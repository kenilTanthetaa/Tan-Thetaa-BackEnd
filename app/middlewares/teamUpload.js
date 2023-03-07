const multer = require('multer')

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/team");
    },
    filename: (req, file, cb) => {
      const ext = file.mimetype.split("/")[1];
      cb(null, `/${file.fieldname}-${Date.now()}.${file.originalname}`);
    },
});

const maxSize = 4 * 1024 * 1024;//1 * 1000 * 1000;

const upload = multer({
    storage: multerStorage,
    limits: { fileSize: maxSize },
    fileFilter(req, file, cb) {
      if(file.fieldname === "profileImg")  {

        if (!file.originalname.match(/\.(jpg|jpeg|png|svg)$/)) {
            return cb(new Error('Please upload a valid image file'))
        }
      }
      if(file.fieldname === "editedImg")  {
        if (!file.originalname.match('.gif')) {
          return cb(new Error('Please upload a valid Edited image file'))
      }
      }

        cb(undefined, true)
    }
})

// .single('file')

// .array('files',5);

module.exports = upload
