const fs = require("fs");

const { google } =
require("googleapis");

const {
  authorize
} = require(
  "../config/googleAuth"
);

// ======================
// GET DRIVE INSTANCE
// ======================

const getDrive =
async () => {

  const auth =
    await authorize();

  return google.drive({

    version: "v3",

    auth,

  });
};

// ======================
// UPLOAD FILE
// ======================

const uploadFile =
async (
  filePath,
  fileName
) => {

  const drive =
    await getDrive();

  const response =
    await drive.files.create({

      requestBody: {

        name: fileName,

        parents: [
          process.env
          .GOOGLE_DRIVE_ID
        ],

      },

      media: {

        mimeType:
          "application/zip",

        body:
          fs.createReadStream(
            filePath
          ),

      },

      fields:
        "id,name",

    });

  return response.data;
};

// ======================
// DELETE FILE
// ======================

const deleteFile =
async (fileId) => {

  const drive =
    await getDrive();

  await drive.files.delete({

    fileId,

  });
};

module.exports = {

  uploadFile,

  deleteFile,

};