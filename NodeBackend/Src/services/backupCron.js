const cron =
require("node-cron");

const {
  createBackup
} = require(
  "../controller/backup_con"
);

// Every day at 2AM

cron.schedule(

  "0 2 * * *",

  async () => {

    console.log(
      "Running auto backup..."
    );

    await createBackup();

  }
);