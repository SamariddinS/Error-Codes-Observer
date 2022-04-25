/*  Dependencies  */
import https from 'https';
import http from 'http';
import path from 'path';
import url from 'url';
import fs from 'fs';
import { environmentToExport as config } from './config.js';
import { handlers } from './handlers.js';
import { lib as _data } from './data.js';
import { helpers } from './helpers.js';


// Instantiate the server module object
export const server = {};


// Instantiate the HTTP server
server.httpServer = http.createServer((req, res) => {
    server.unifiedServer(req, res);
});


// Instantiate the HTTPS server
server.httpsServerOptions = {
    'key': fs.readFileSync(path.join(path.dirname('__dirname'), '/././https/key.pem')),
    'curt': fs.readFileSync(path.join(path.dirname('__dirname'), '/././https/cert.pem')),
};

server.httpsServer = https.createServer(server.httpsServerOptions, (req, res) => {
    server.unifiedServer(req, res);
});


// All the server logic for both the http and https server
server.unifiedServer = (req, res) => {
    // Get the URL and parse it
    const parsedUrl = url.parse(req.url, true);

    // Get the path
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // Get the query string as an object
    const queryStringObject = parsedUrl.query;

    // Get the HTTP Method
    const method = req.method.toLowerCase();

    // Get the headers as an object
    const headers = req.headers;

    // Get the payload, if any
    let buffer = '';

    req.on('data', (data) => {
        buffer += new TextDecoder().decode(data);
    });
    req.on('end', () => {

        // Check the handler this request should go to. If one is not found, use the notFound handler instead.
        const chosenHandler = typeof(server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : handlers.notFound;

        // Construct the data object to send to the handler
        const data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'payload': helpers.parseJsonToObject(buffer),
        };

        // Route the request to the handler specified in the router
        chosenHandler(data, (statusCode, payload) => {

            // Use the status code called back handler, or default status code to 200
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

            // Use the payload called back by the handler, or default payload to an empty object
            payload = typeof(payload) == 'object' ? payload : {};

            // Convert the payload to a string
            const payloadString = JSON.stringify(payload);

            // Return the response
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            // Log the request path
            console.log("Returning this response: ", statusCode, payloadString);
        });

    });
};

// Define a request router
server.router = {
    'ping': handlers.ping,
    'users': handlers.users,
    'tokens': handlers.tokens,
    'checks': handlers.checks,
};

// Init script
server.init = () => {
    // Start the HTTP server
    server.httpServer.listen(config.httpPort, () => {
        console.log(`The server is listening ob port ${config.httpPort}`);
    });

    // Start the HTTPS server
    server.httpsServer.listen(config.httpsPort, () => {
        console.log(`The server is listening ob port ${config.httpsPort}`);
    });
}