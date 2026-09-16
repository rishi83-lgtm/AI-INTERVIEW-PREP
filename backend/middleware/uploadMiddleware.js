import multer from 'multer';

const storage = multer.memoryStorage();

export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 5,
  },
  fileFilter: (_req, file, callback) => {
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/markdown',
      'text/csv',
      'image/png',
      'image/jpeg',
      'image/webp',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ];

    const isAllowedName = /\.(pdf|doc|docx|txt|md|csv|png|jpg|jpeg|webp|ppt|pptx)$/i.test(file.originalname);

    if (isAllowedName || allowedMimeTypes.includes(file.mimetype)) {
      return callback(null, true);
    }

    callback(new Error('Unsupported file type. Please upload a PDF, document, text file, or image.'));
  },
}).array('files', 5);
