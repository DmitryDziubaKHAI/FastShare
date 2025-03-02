const FileRepository = require('./../repositories/FileRepository');
const FileService = require('../services/FileService');

class FileController {
    constructor() {
        this.fileService = new FileService(new FileRepository());
    }
    
    /**
     * @param {import('express').Request & {file: UploadFileDescription} & {session: object}} req
     * @param {import('express').Response} res
     */
    async uploadFile(req, res) {
        const file = await this.fileService.saveFile(req.file);
        res.status(201).json({ success: true, file });
    }

    /**
     * @param {import('express').Request & {session: object}} req
     * @param {import('express').Response} res
     */
    listFiles(req, res) {
        const files = this.fileService.getFilesListByUserId(req.session.user.id);
        res.status(200).json(files.map(file => {
            file.downloadPage = '/download/' + file.id;
            return file;
        }));
    }

    /**
     * @param {import('express').Request & {session: object}} req
     * @param {import('express').Response} res
     */
    async downloadFile(req, res) {
        const {id, key} = req.params;
        const file = this.fileService.getFileById(id);
        if(!file || !(await file.checkDownloadTmpKey(key, req.session.user.id))) {
            res.status(404).send('Not found 404');
            return;
        }
        res.download(file.filepath);
    }

    /**
     * @param {import('express').Request & {session: object}} req
     * @param {import('express').Response} res
     */
    async downloadPage(req, res) {
        const id = req.params.id;
        const file = this.fileService.getFileById(id);
        if(!file) {
            res.status(404).send('Not found 404');
            return;
        }
        let isPasswordInvalid = false;
        if(req.method === 'POST') {
            const {password} = req.body;
            if(await file.checkPassword(password)) {
                const key = file.getDownloadTmpKey(req.session.user.id);
                res.redirect(`/download/${file.id}/${key}`);
                return;
            } else {
                isPasswordInvalid = true;
            }
        }
        res.render('layout', {
            content: 'downloadPage',
            file: file,
            isPasswordInvalid: isPasswordInvalid
        });
    }
}

module.exports = new FileController();
