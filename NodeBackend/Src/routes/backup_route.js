const backup_con =
require(
  "../controller/backup_con"
);

const backup = (app) => {

  app.post(
    "/api/backup/create",

    backup_con.createBackup
  );

  app.get(
    "/api/backup",

    backup_con.getBackups
  );

  app.delete(
    "/api/backup/:id",

    backup_con.removeBackup
  );
};

module.exports =
backup;