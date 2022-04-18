//   ***   Helpers for various tasks    ***


// Dependencies
import { createHmac } from "crypto";
import { environmentToExport as config } from "../config.js";


// Container for all the helpers
export const helpers = {};

// Create a SHA256 hash
helpers.hash = (str) => {
    if (typeof(str) == 'string' && str.length > 0) {
        const hash = createHmac('sha256', config.hashingSecret).update(str).digest('hex');

        return hash;
    } else {
        return false;
    }
};

// Parse a JSON string to an object in all cases, without throwing
helpers.parseJsonToObject = (str) => {
    try {
        const obj = JSON.parse(str);
        return obj;
    } catch (e) {
        return {};
    }
}

// Create a string of random alphanumeric, of a given length
helpers.createRandomString = (strLen) => {
    strLen = typeof(strLen) == 'number' && strLen > 0 ? strLen : false;
    if (strLen) {
        // Define all the possible charecters that could go into a string
        const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';

        // Srart the final string
        let str = '';
        for (let i = 1; i <= strLen; i++) {
            // Get a random character from the possibleChar string
            const randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
            // Append this char to the final string
            str += randomCharacter;
        }

        // Return the final string
        return str;
    } else {
        return false;
    }
};