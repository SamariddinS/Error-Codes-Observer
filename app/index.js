//  ***   Dependencies   ***
import { server } from "./lib/server.js";
import { workers } from "./lib/workers.js";


// Declare the app
export const app = {};

// Init the function
app.init = () => {
    // Start the server
    server.init();

    // Start the workers
    workers.init();

};

// Execute
app.init();