const fs = require("fs");

const path = require("path");

const readline =
  require("readline");

const { google } =
  require("googleapis");


const oauthPath =
path.join(
  __dirname,
  "../../oauth.json"
);

const TOKEN_PATH =
path.join(
  __dirname,
  "../../token.json"
);

const credentials =
require(oauthPath);

const {
  client_secret,
  client_id,
  redirect_uris,
} =
credentials.installed;

const oAuth2Client =
new google.auth.OAuth2(

  client_id,

  client_secret,

  redirect_uris[0]

);

const SCOPES = [
  "https://www.googleapis.com/auth/drive"
];

// ======================
// GET TOKEN
// ======================

const authorize = async () => {

  // ======================
  // TOKEN EXISTS
  // ======================

  if (
    fs.existsSync(
      TOKEN_PATH
    )
  ) {

    try {

      const token =
        JSON.parse(

          fs.readFileSync(
            TOKEN_PATH
          )

        );

      oAuth2Client
        .setCredentials(
          token
        );

      // Test token

      await oAuth2Client
        .getAccessToken();

      console.log(
        "✅ Google token valid"
      );

      return oAuth2Client;

    } catch (err) {

      console.log(
        "❌ TOKEN INVALID:",
        err.message
      );

      // Delete bad token

      if (
        fs.existsSync(
          TOKEN_PATH
        )
      ) {

        fs.unlinkSync(
          TOKEN_PATH
        );

        console.log(
          "🗑 Old token removed"
        );

      }

    }

  }

  // ======================
  // CREATE NEW TOKEN
  // ======================

  const authUrl =
    oAuth2Client
      .generateAuthUrl({

        access_type:
          "offline",

        prompt:
          "consent",

        scope:
          SCOPES,

      });

  console.log(
    "\n🔐 Authorize this app:\n"
  );

  console.log(
    authUrl
  );

  const open =
    (await import("open"))
      .default;

  await open(
    authUrl
  );

  const rl =
    readline.createInterface({

      input:
        process.stdin,

      output:
        process.stdout,

    });

  return new Promise(

    (resolve, reject) => {

      rl.question(

        "\nPaste authorization code here: ",

        async (code) => {

          rl.close();

          try {

            const {
              tokens
            } =

            await oAuth2Client
              .getToken(
                code
              );

            oAuth2Client
              .setCredentials(
                tokens
              );

            fs.writeFileSync(

              TOKEN_PATH,

              JSON.stringify(

                tokens,

                null,

                2

              )

            );

            console.log(
              "✅ New token saved"
            );

            resolve(
              oAuth2Client
            );

          } catch (err) {

            console.log(
              "❌ GOOGLE AUTH ERROR:",
              err.message
            );

            reject(
              err
            );

          }

        }

      );

    }

  );

};

module.exports = {
  authorize,
};