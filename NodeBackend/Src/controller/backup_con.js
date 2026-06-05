const mysqldump =
require("mysqldump");

const path =
require("path");

const fs =
require("fs");

const archiver =
require("archiver");

const db =
require("../config/db");
const {logerror}=require("../config/helper");
const {
  uploadFile,
  deleteFile,
} = require(
  "../config/googleDrive"
);

// ======================
// CREATE ZIP
// ======================

const createZip =
(
  sourceFile,
  zipFile
) => {

  return new Promise(
    (
      resolve,
      reject
    ) => {

      const output =
        fs.createWriteStream(
          zipFile
        );

      const archive =
        archiver(
          "zip",
          {
            zlib: {
              level: 9,
            },
          }
        );

      output.on(
        "close",
        resolve
      );

      archive.on(
        "error",
        reject
      );

      archive.pipe(output);

      archive.file(
        sourceFile,
        {
          name:
            path.basename(
              sourceFile
            ),
        }
      );

      archive.finalize();
    }
  );
};

// ======================
// CREATE BACKUP
// ======================

const createBackup =
async (
  req,
  res
) => {

  try {

    const timestamp =
      Date.now();

    const sqlName =
      `backup-${timestamp}.sql`;

    const zipName =
      `backup-${timestamp}.zip`;

    const sqlPath =
      path.join(
        __dirname,
        "../backups",
        sqlName
      );

    const zipPath =
      path.join(
        __dirname,
        "../backups",
        zipName
      );

    // ======================
    // CREATE SQL
    // ======================

    await mysqldump({

      connection: {

        host:
          process.env.DB_HOST,

        user:
          process.env.DB_USER,

        password:
          process.env.DB_PASSWORD,

        database:
         process.env.DB_NAME,

      },

      dumpToFile:
        sqlPath,

    });

    // ======================
    // CREATE ZIP
    // ======================

    await createZip(
      sqlPath,
      zipPath
    );

    // ======================
    // UPLOAD
    // ======================

    const driveFile =
      await uploadFile(
        zipPath,
        zipName
      );

    // ======================
    // FILE SIZE
    // ======================

    const stats =
      fs.statSync(
        zipPath
      );

    const fileSize =

      (
        stats.size /
        1024 /
        1024
      ).toFixed(2)

      + " MB";

    // ======================
    // SAVE DB
    // ======================

    await db.query(
      `
      INSERT INTO backups (

        FileName,

        GoogleFileId,

        FileSize,

        Status,

        BackupType

      )

      VALUES (?, ?, ?, ?, ?)
      `,
      [
        zipName,

        driveFile.id,

        fileSize,

        "Completed",

        "Automatic",
      ]
    );

    // ======================
    // CLEANUP
    // ======================

    if (
      fs.existsSync(
        sqlPath
      )
    ) {

      fs.unlinkSync(
        sqlPath
      );
    }

    if (
      fs.existsSync(
        zipPath
      )
    ) {

      fs.unlinkSync(
        zipPath
      );
    }

    // ======================
    // RESPONSE
    // ======================

    if (res) {

      res.json({

        message:
          "Backup uploaded successfully",

      });
    }

  } catch (error) {
    logerror("Create Backup",error,res);
  }
};

// ======================
// GET BACKUPS
// ======================

const getBackups =
async (req, res) => {

  try {

    const [rows] =
      await db.query(
        `
        SELECT *
        FROM backups

        ORDER BY Id DESC
        `
      );

    res.json({

      backups:
        rows,

    });

  } catch (error) {

   logerror("Get Backup",error,res);
  }
};

// ======================
// DELETE BACKUP
// ======================

const removeBackup =
async (req, res) => {

  try {

    const { id } =
      req.params;

    const [rows] =
      await db.query(
        `
        SELECT *
        FROM backups

        WHERE Id=?
        `,
        [id]
      );

    const backup =
      rows[0];

    await deleteFile(
      backup.GoogleFileId
    );

    await db.query(
      `
      DELETE FROM backups

      WHERE Id=?
      `,
      [id]
    );

    res.json({

      message:
        "Backup deleted",

    });

  } catch (error) {

   logerror("Delete Backup",error,res);
  }
};

module.exports = {

  createBackup,

  getBackups,

  removeBackup,

};