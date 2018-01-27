import multer from 'multer';
import uuid from 'uuid/v4';

const MAX_FILES_TO_UPLOAD = 100;

let _storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    // console.log(file.mimetype)
    cb(null, uuid() + _getExtension(file));
  }
});

let _getExtension = file => {
  // this function gets the filename extension by determining mimetype. To be exanded to support others, for example .jpeg or .tiff
  let res = '';
  if (file.mimetype === 'image/jpeg') {
    res = '.jpg';
  }
  if (file.mimetype === 'image/png') {
    res = '.png';
  }

  return res;
};

let _uploadConfig = multer({
  storage: _storage,
  limits: { fileSize: 6048576 } // limit file size to 1048576 bytes or 1 MB
  // ,fileFilter:
});

let upload = _uploadConfig.array('files', MAX_FILES_TO_UPLOAD)

export default upload;
