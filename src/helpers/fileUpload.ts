import { diskStorage } from "multer";
import * as fs from "fs";
import * as path from "path";

export const multerOptions = {

    limits: {
        fileSize: 1024 * 1024 * 2,
    },

    // Check the mimetypes to allow for upload
    fileFilter: (req: any, file: any, cb: any) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
            cb(Error("Not allowed this file format"), false);
        }
        cb(null, true);
    },

    storage: diskStorage({

        destination(req, file, cb) {
            cb(null, path.join(__dirname, '../../', './files'))
        },

        // File modification details
        filename: (req: any, file: any, cb: any) => {
            if (!fs.existsSync('./files')) {
                fs.mkdirSync('./files')
            }
            cb(null, `${Date.now()}-${file.originalname}`);
        },
    }),
};