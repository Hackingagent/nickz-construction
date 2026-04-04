import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'images') {
      cb(null, path.join(__dirname, '../uploads/projects'));
    } else if (file.fieldname === 'image_url') {
      cb(null, path.join(__dirname, '../uploads/services'));
    } else if (file.fieldname === 'image') {
      cb(null, path.join(__dirname, '../uploads/team'));
    } else {
      cb(null, path.join(__dirname, '../uploads'));
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

// Initialize multer
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

// Single image upload for services
export const uploadServiceImage = upload.single('image_url');

// Multiple images upload for projects
export const uploadProjectImages = upload.array('images', 10);

// Single image upload for team members
export const uploadTeamImage = upload.single('image');
