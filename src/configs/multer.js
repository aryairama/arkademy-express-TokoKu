const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const path = require('path');

const userAvatarStorage = multer.diskStorage({
  destination: (req, file, next) => {
    next(null, path.join(path.dirname(''), '/public/img/avatars'));
  },
  filename: (req, file, next) => {
    const nameAvatar = `${uuidv4()}${path.extname(file.originalname)}`;
    req.body.destinationAvatar = `public/img/avatars/${nameAvatar}`;
    next(null, nameAvatar);
  },
});
const validationFileImgUserAvatar = (req, file, next) => {
  const extension = path.extname(file.originalname).toLowerCase();
  if (extension !== '.png' && extension !== '.jpg') {
    next(new Error('Avatar must be in .jpg .png format'), false);
  }
  next(null, true);
};
const multerUserAvatar = multer({
  storage: userAvatarStorage,
  fileFilter: validationFileImgUserAvatar,
});
const uploudUserAvatar = multerUserAvatar.single('avatar');

module.exports = uploudUserAvatar;
