const File = require('../../models/File');
/**
 * @typedef {object} FileRepositoryInterface
 * @property {function(file: File): void} saveFile
 * @property {function(id: number): File|null} getFileById
 * @property {function(id: number): File[]} getFilesListByUserId
 */