const uuid = require('uuid');
const mime = require('mime-types');
const fs = require('fs');
const path = require('path');
const File = require('../models/File');

class FileService {
    /**
     * @param {FileRepositoryInterface} fileRepository
     */
    constructor(fileRepository) {
        this.repository = fileRepository;
        this.uploadDir = path.join(__dirname, '..', 'uploads');
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir);
        }
    }

    /**
     * @param {UploadFileDescription} file
     * @returns {File}
     */
    async saveFile(file) {
        const filePath = path.join(this.uploadDir, uuid.v4() + '.' + mime.extension(file.mimetype));
        fs.writeFileSync(filePath, file.buffer);
        const fileModel = new File();

        fileModel.userId = file.userId;
        fileModel.filename = file.originalname;
        fileModel.filepath = filePath;
        fileModel.size = file.size;
        fileModel.password = file.password;
        await fileModel.hashPassword();

        this.repository.saveFile(fileModel)
        return fileModel;
    }

    /**
     * @param {number} id
     * @returns {File[]}
     */
    getFilesListByUserId(id) {
        return this.repository.getFilesListByUserId(id);
    }

    /**
     * @param {number} id
     * @returns {null|File}
     */
    getFileById(id) {
        return this.repository.getFileById(id);
    }
}

module.exports = FileService;