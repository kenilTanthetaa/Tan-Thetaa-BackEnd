const multer = require('multer')
const multerStorage =  multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `uploads/portfolio`);
    },
    filename: (req, file, cb) => {
      const ext = file.mimetype.split("/")[1];
      cb(null, `/${file.fieldname}-${Date.now()}-${file.originalname}`);
    },
});

const maxSize = 2 * 1024 * 1024; // 2 MB (max file size) //1 * 1000 * 1000;
const upload = multer({
    storage: multerStorage,
    limits: { fileSize: maxSize },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|svg)$/)) {
            return cb(new Error('Please upload a valid image file'))
        }
        cb(undefined, true)
    }
})
// single('file') // .array('file',5);
module.exports = upload