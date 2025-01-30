import multer from "multer";

const storage = multer.diskStorage({
    filename: (req, file, callback) => {
        callback(null, Date.now() + "-" + file.originalname); // Added timestamp to prevent filename conflicts
    }
});

const upload = multer({ storage });

export default upload;
