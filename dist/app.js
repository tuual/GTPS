"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseServer_1 = require("./structures/BaseServer");
const node_fs_1 = __importDefault(require("node:fs"));
const Utils_1 = require("./utils/Utils");
if (!node_fs_1.default.existsSync("./assets"))
    throw new Error("Could not find 'assets' folder, please create new one.");
if (!node_fs_1.default.existsSync("./assets/ssl"))
    throw new Error("SSL certificate are required for https web server.");
if (!node_fs_1.default.existsSync("./assets/ssl/server.crt"))
    throw new Error("'assets/ssl/server.crt' are required for https web server.");
if (!node_fs_1.default.existsSync("./assets/ssl/server.key"))
    throw new Error("assets/ssl/server.key are required for https web server.");
if (!node_fs_1.default.existsSync("./assets/dat/items.dat"))
    throw new Error("items.dat not exist on 'assets/dat/items.dat'");
const server = new BaseServer_1.BaseServer();
server.start();
//process.on("SIGINT", () => handleSaveAll(server, true));
process.on("SIGQUIT", () => (0, Utils_1.handleSaveAll)(server, true));
process.on("SIGTERM", () => (0, Utils_1.handleSaveAll)(server, true));
process.on('SIGINT', () => {
    // This function will be executed when Ctrl+C is pressed
    (0, Utils_1.handleSaveAll)(server, true);
    const filePath = '/Users/macbook/Desktop/GrowAsia/number.txt';
    // Open the file for writing
    try {
        // Write "0" to the file synchronously
        node_fs_1.default.writeFileSync(filePath, '0');
        console.log('File content updated to "0"');
    }
    catch (err) {
        console.error(`Error writing to file: ${err}`);
    }
    console.log('Ctrl+C pressed. Stopping the application...');
    // You can add any cleanup or exit logic here
    process.exit(0); // Exit the application
});
