const File = require('../models/File');
const path = require("path");
const fs = require("fs");

/**
 * @typedef {object} UserDB
 * @property {Object<number,object>} data fileId => attributes
 * @property {{count: number, lastId: number}} meta
 */

/**
 * @implements {FileRepositoryInterface}
 */
class FileRepository {
    /**
     * @type {string}
     * @protected
     */
    dir;

    constructor() {
        this.dir = path.join(__dirname, '..', 'runtime', 'filesDb');
    }

    /**
     * @param {string} name
     * @param {object} index
     */
    writeIndex(name, index) {
        const indexFile = path.join(this.dir, `index_${name}.json`);
        fs.writeFileSync(indexFile, JSON.stringify(index, null, 2));
    }

    /**
     * @param {string} name
     * @returns {object|null}
     */
    readIndex(name) {
        const indexFile = path.join(this.dir, `index_${name}.json`);
        if (fs.existsSync(indexFile)) {
            const index = fs.readFileSync(indexFile).toString();
            return JSON.parse(index);
        }
        return null;
    }

    /**
     * @param {number} id
     * @param {UserDB} db
     */
    writeUserDb(id, db) {
        const dbFile = path.join(this.dir, `file_${id}.json`);
        fs.writeFileSync(dbFile, JSON.stringify(db, null, 2));
    }

    /**
     * @param {number} id
     * @returns {UserDB}
     */
    readUserDb(id) {
        const dbFile = path.join(this.dir, `file_${id}.json`);
        if (fs.existsSync(dbFile)) {
            const data = fs.readFileSync(dbFile).toString();
            return JSON.parse(data);
        }
        return {
            meta: {
                count: 0,
                lastId: 0
            },
            data: {}
        };
    }

    /**
     * The method saves a file model to a storage
     * @param {File} file
     */
    saveFile(file) {
        const db = this.readUserDb(file.userId);
        if (!file.id) {
            file.id = ++db.meta.lastId;
            db.meta.count++;
        }
        db.data[file.id] = file;
        this.writeUserDb(file.userId, db);
        const indexFileIdUserId = this.readIndex('file_id_user_id') || {};
        indexFileIdUserId[file.id] = file.userId;
        this.writeIndex('file_id_user_id', indexFileIdUserId);
    }

    /**
     * The method retrieves a file model by its id
     * @param {number} id
     * @returns {File|null}
     */
    getFileById(id) {
        const index = this.readIndex('file_id_user_id') || {};
        const userId = index[id];
        if(typeof userId !== 'number') {
            return null;
        }
        const db = this.readUserDb(userId);
        const fileData = db.data[id];
        return fileData ? File.fromAttributes(fileData) : null;
    }

    /**
     * The method retrieves file models by user id
     * @param {number} id
     * @returns {File[]}
     */
    getFilesListByUserId(id) {
        const db = this.readUserDb(id);
        return Object.values(db.data).map(attributes => File.fromAttributes(attributes));
    }
}

module.exports = FileRepository;