const settings_con = require("../controller/setting_con");

const {
  createUpload
} = require("../config/cloudinary");

const upload =
  createUpload("settings");

const settings = (app) => {

  app.get(
    "/api/settings",
    settings_con.getSettings
  );

  app.put(
    "/api/settings",
    upload.fields([
  {
    name: "logo",
    maxCount: 1,
  },
  {
    name: "schoolPicture",
    maxCount: 1,
  },
]),
    settings_con.updateSettings
  );

};

module.exports = settings;