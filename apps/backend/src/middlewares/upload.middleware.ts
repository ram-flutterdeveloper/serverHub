import multer from "multer";
import sharp from "sharp";

import path from "path";
import fs from "fs";

import {
  Request,
  Response,
  NextFunction,
} from "express";


// ======================================================
// GENERIC DISK STORAGE
// ======================================================

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

    destination(
      req,
      file,
      cb
    ) {
      cb(null, uploadPath);
    },

    filename(
      req,
      file,
      cb
    ) {

      const ext =
        path.extname(
          file.originalname
        );

      const fileName =
        Date.now() +
        "-" +
        Math.round(
          Math.random() * 1000000
        ) +
        ext;

      cb(
        null,
        fileName
      );
    },

  });

};


// ======================================================
// PROVIDER DOCUMENTS
// EXISTING - KEEP THIS
// ======================================================

export const uploadProviderDocuments =
  multer({

    storage:
      createStorage(
        "provider-documents"
      ),

    limits: {
      fileSize:
        5 * 1024 * 1024,
    },

    fileFilter(
      req,
      file,
      cb
    ) {

      if (
        file.mimetype.startsWith(
          "image/"
        )
      ) {

        cb(
          null,
          true
        );

      } else {

        cb(
          new Error(
            "Only image files are allowed"
          )
        );

      }

    },

  });


// ======================================================
// BOOKING MEDIA
// EXISTING - KEEP THIS
// ======================================================

export const uploadBookingMedia =
  multer({

    storage:
      createStorage(
        "booking-media"
      ),

    limits: {

      files: 5,

      fileSize:
        50 * 1024 * 1024,

    },

    fileFilter(
      req,
      file,
      cb
    ) {

      const allowedTypes = [

        "image/jpeg",
        "image/png",
        "image/webp",

        "video/mp4",
        "video/quicktime",

      ];

      if (
        allowedTypes.includes(
          file.mimetype
        )
      ) {

        cb(
          null,
          true
        );

      } else {

        cb(
          new Error(
            "Only JPG, PNG, WEBP, MP4 and MOV files are allowed"
          )
        );

      }

    },

  });


// ======================================================
// BOOKING MEDIA UPLOAD
// EXISTING - KEEP THIS
// ======================================================

export const bookingMediaUpload =
  multer({

    storage:
      createStorage(
        "booking-media"
      ),

    limits: {

      fileSize:
        50 * 1024 * 1024,

    },

    fileFilter(
      req,
      file,
      cb
    ) {

      const allowedTypes = [

        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp",

        "video/mp4",
        "video/mpeg",
        "video/quicktime",
        "video/webm",

      ];

      if (
        allowedTypes.includes(
          file.mimetype
        )
      ) {

        cb(
          null,
          true
        );

      } else {

        cb(
          new Error(
            "Only image and video files are allowed"
          )
        );

      }

    },

  });


// ======================================================
// IMAGE UPLOAD
// MEMORY STORAGE
// Used only for Category/Service/Package/Banner
// ======================================================

const imageUpload =
  multer({

    storage:
      multer.memoryStorage(),

    limits: {

      // Maximum ORIGINAL image size
      fileSize:
        10 * 1024 * 1024,

    },

    fileFilter(
      req,
      file,
      cb
    ) {

      const allowedTypes = [

        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp",

      ];

      if (
        allowedTypes.includes(
          file.mimetype
        )
      ) {

        cb(
          null,
          true
        );

      } else {

        cb(
          new Error(
            "Only JPG, JPEG, PNG and WEBP images are allowed"
          )
        );

      }

    },

  });


// ======================================================
// COMPRESS + CONVERT IMAGE TO WEBP
// ======================================================

// export const uploadAndCompressImage = (
//   folder: string
// ) => {

//   return (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) => {

//     // --------------------------------------------
//     // Receive image in memory
//     // --------------------------------------------

//     imageUpload.single("image")(
//       req,
//       res,
//       async (
//         error
//       ) => {

//         try {

//           // ----------------------------------------
//           // Multer error
//           // ----------------------------------------

//           if (error) {

//             return next(
//               error
//             );

//           }


//           // ----------------------------------------
//           // No image uploaded
//           // ----------------------------------------

//           if (!req.file) {

//             return next();

//           }


//           // ----------------------------------------
//           // Create destination folder
//           // ----------------------------------------

//           const uploadPath =
//             path.join(
//               process.cwd(),
//               "uploads",
//               folder
//             );


//           if (
//             !fs.existsSync(
//               uploadPath
//             )
//           ) {

//             fs.mkdirSync(
//               uploadPath,
//               {
//                 recursive: true,
//               }
//             );

//           }


//           // ----------------------------------------
//           // Generate WebP filename
//           // ----------------------------------------

//           const fileName =
//             `${Date.now()}-${Math.round(
//               Math.random() * 1000000
//             )}.webp`;


//           const outputPath =
//             path.join(
//               uploadPath,
//               fileName
//             );


//           // ----------------------------------------
//           // Sharp processing
//           // ----------------------------------------

//           await sharp(
//             req.file.buffer
//           )

//             // Fix camera orientation
//             .rotate()

//             // Maximum image dimensions
//             .resize({

//               width: 1200,

//               height: 1200,

//               fit: "inside",

//               withoutEnlargement:
//                 true,

//             })

//             // Convert to WebP
//             .webp({

//               quality: 80,

//               effort: 4,

//             })

//             // Save
//             .toFile(
//               outputPath
//             );


//           // ----------------------------------------
//           // Update req.file
//           // ----------------------------------------

//           req.file.filename =
//             fileName;

//           req.file.path =
//             outputPath;

//           req.file.destination =
//             uploadPath;

//           req.file.mimetype =
//             "image/webp";

//           req.file.size =
//             fs.statSync(
//               outputPath
//             ).size;


//           // ----------------------------------------
//           // Continue request
//           // ----------------------------------------

//           next();

//         } catch (error) {

//           next(error);

//         }

//       }
//     );

//   };

// };


export const uploadAndCompressImage = (
  folder: string,
  fieldName: string = "image"
) => {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {

    imageUpload.single(fieldName)(
      req,
      res,
      async (error) => {

        if (error) {
          return next(error);
        }

        if (!req.file) {
          return next();
        }

        try {
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

          const fileName =
            `${Date.now()}-${Math.round(
              Math.random() * 1000000
            )}.webp`;

          const outputPath =
            path.join(uploadPath, fileName);

          await sharp(req.file.buffer)
            .rotate()
            .resize({
              width: 1200,
              height: 1200,
              fit: "inside",
              withoutEnlargement: true,
            })
            .webp({
              quality: 80,
              effort: 4,
            })
            .toFile(outputPath);

          req.file.filename = fileName;
          req.file.path = outputPath;
          req.file.destination = uploadPath;
          req.file.mimetype = "image/webp";
          req.file.size =
            fs.statSync(outputPath).size;

          next();

        } catch (error) {
          next(error);
        }
      }
    );
  };
};