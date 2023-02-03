import multer from "multer";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync, mkdirSync } from "fs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
};

export const randomColor = `#${Math.floor(Math.random() * 16777215).toString(
  16
)}`;

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const path = join(__dirname, "/uploads/");

    if (!existsSync(path)) {
      mkdirSync(path, { recursive: true });
    }
    cb(null, path);
  },
  filename(req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage });
