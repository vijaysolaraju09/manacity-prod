import multer from "multer";

const imgconfig = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./assets/profile-images");
  },
  filename: (req, file, callback) => {
    callback(null, `image-${Date.now()}.${file.originalname}`);
  },
});

// img filter
const isImage = (req, file, callback) => {
  if (file.mimetype.startsWith("image")) {
    callback(null, true);
  } else {
    callback(new Error("only images are allowed"));
  }
};

export const upload = multer({
  storage: imgconfig,
  fileFilter: isImage,
});
