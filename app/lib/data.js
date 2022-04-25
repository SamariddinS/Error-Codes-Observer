//  ****   Library for storing anf editing data   ****

// Dependencies
import fs from 'fs';
import path from 'path';
import { helpers } from './helpers.js';

// Container for the module (to be exported)
export const lib = {};

// Base directory of the data folder
lib.baseDir = path.join(path.dirname('__dirname'), '/./.data/');

// Write data to a file
lib.create = (dir, file, data, callback) => {
    // Open the file for writing
    fs.open(lib.baseDir + dir + '/' + file + '.json', 'wx', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            // Convert data to string
            const stringData = JSON.stringify(data);

            // Write to the file and clone it
            fs.writeFile(fileDescriptor, stringData, (err) => {
                if (!err) {
                    fs.close(fileDescriptor, (err) => {
                        if (!err) {
                            callback(false);
                        } else {
                            callback('Error closing new file');
                        }
                    })
                } else {
                    callback('Error writing to new file');
                }
            });

        } else {
            callback('Could not crate file, it may be already exist');
        }
    });
};

// Read data from a file
lib.read = (dir, file, callback) => {
    fs.readFile(lib.baseDir + dir + '/' + file + '.json', 'utf8', (err, data) => {
        if (!err && data) {
            const parseData = helpers.parseJsonToObject(data);
            callback(false, parseData);
        } else {
            callback(err, data);
        }
    });
};

// Update data inside a file
lib.update = (dir, file, data, callback) => {
    // Open the file for writing
    fs.open(lib.baseDir + dir + '/' + file + '.json', 'r+', (err, fileDescriptor) => {
        if (!err) {
            // Convert data to string
            const stringData = JSON.stringify(data);

            // Truncate the file
            fs.ftruncate(fileDescriptor, (err) => {
                if (!err) {
                    // Write to the file and close it
                    fs.writeFile(fileDescriptor, stringData, (err) => {
                        if (!err) {
                            fs.close(fileDescriptor, (err) => {
                                if (!err) {
                                    callback(false);
                                } else {
                                    callback('Error closing existing file');
                                }
                            });
                        } else {
                            callback('Error writing to existing file');
                        }
                    });
                } else {
                    callback('Error truncating file')
                }
            });
        } else {
            callback('Could not open the file for update, it may not exist yet');
        }
    });
};

// Deleting a file
lib.delete = (dir, file, callback) => {
    // Unlike the file
    fs.unlink(lib.baseDir + dir + '/' + file + '.json', (err) => {
        if (!err) {
            callback(false);
        } else {
            callback('Error deleting file');
        }
    });
};


// list all the items in a directory
lib.list = (dir, callback) => {
    fs.readdir(lib.baseDir + dir + '/', (err, data) => {
        if (!err && data && data.length > 0) {

            const trimmedFileNames = [];

            data.forEach((fileName) => {
                trimmedFileNames.push(fileName.replace('.json', ''));
            });

            callback(false, trimmedFileNames);

        } else { callback(err, data); }
    });
}