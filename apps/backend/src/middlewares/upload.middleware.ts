import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
});



const createStorage = (folder: string) => {

  const uploadPath = path.join(
    process.cwd(),
    "uploads",
    folder
  );

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, {
      recursive: true,
    });
  }

  return multer.diskStorage({

    destination(req, file, cb) {
      cb(null, uploadPath);
    },

    filename(req, file, cb) {

      const ext = path.extname(file.originalname);

      const fileName =
        Date.now() +
        "-" +
        Math.round(Math.random() * 1000000) +
        ext;

      cb(null, fileName);

    },

  });

};

export const uploadProviderDocuments = multer({

  storage: createStorage(
    "provider-documents"
  ),

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter(req, file, cb) {

    if (
      file.mimetype.startsWith("image/")
    ) {

      cb(null, true);

    } else {

      cb(
        new Error(
          "Only image files are allowed"
        )
      );

    }

  },

});