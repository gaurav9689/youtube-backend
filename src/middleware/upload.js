import multer from 'multer';
import path from 'path';
import fs from 'fs';


const uploadDir = process.env.UPLOAD_DIR || 'uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });


const storage = multer.diskStorage({
destination: (req, file, cb) => cb(null, uploadDir),
filename: (req, file, cb) => {
const ext = path.extname(file.originalname);
const base = path.basename(file.originalname, ext).replace(/\s+/g, '_');
cb(null, `${Date.now()}_${base}${ext}`);
},
});


const fileFilter = (req, file, cb) => {
const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'video/mp4', 'video/webm'];
if (allowed.includes(file.mimetype)) cb(null, true);
else cb(new Error('Unsupported file type'));
};


export const upload = multer({
storage,
fileFilter,
limits: { fileSize: (Number(process.env.MAX_FILE_SIZE_MB) || 500) * 1024 * 1024 },
});