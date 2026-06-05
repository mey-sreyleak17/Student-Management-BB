const cloudinary = require("cloudinary").v2;

const multer = require("multer");

const {
  CloudinaryStorage
} = require(
  "multer-storage-cloudinary"
);

cloudinary.config({

  cloud_name:
    process.env.CLOUDINARY_CLOUD_NAME,

  api_key:
    process.env.CLOUDINARY_API_KEY,

  api_secret:
    process.env.CLOUDINARY_API_SECRET

});

const createStorage = (folderName) => {

  return new CloudinaryStorage({

    cloudinary,

    params: async (req, file) => ({

      folder: folderName,

      allowed_formats: [
        "jpg",
        "jpeg",
        "png",
        "webp"
      ],

      public_id:
        Date.now() +
        "-" +
        file.originalname

    })

  });

};

const createUpload = (
  folderName
) => {

  return multer({

    storage:
      createStorage(folderName),

    limits: {
      fileSize:
        5 * 1024 * 1024
    }

  });

};

module.exports = {
  createUpload
};