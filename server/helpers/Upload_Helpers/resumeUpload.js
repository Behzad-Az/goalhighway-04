const multer = require('multer');

const getRandomDocName = () => {
  let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let length = 4;
  let randomName = '';
  for(let i = 0; i < length; i++) {
    randomName += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${randomName}_`;
};

const acceptableMimeType = [
  'image/jpeg',
  'image/png',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const resumeStorage = multer.diskStorage({
  destination: './uploads/resumes/',
  filename: (req, file, cb) => {
    let ext = '.unknown';
    switch (file.mimetype) {
      case 'image/jpeg':
        ext = '.jpeg';
        break;
      case 'image/png':
        ext = '.png';
        break;
      case 'application/pdf':
        ext = '.pdf';
        break;
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        ext = '.docx';
        break;
      default:
       new Error('unknown file type');
    }
    cb(null, getRandomDocName() + Date.now() + ext);
  }
});

module.exports = multer({
  storage: resumeStorage,
  limits: { fileSize: 20000000, files: 1 },
  fileFilter: (req, file, cb) => {
    acceptableMimeType.includes(file.mimetype) ? cb(null, true) : cb(null, false, new Error('unknown file type'));
  }
});
