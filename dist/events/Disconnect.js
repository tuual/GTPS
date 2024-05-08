"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Listener_1 = require("../abstracts/Listener");
const fs = __importStar(require("fs"));
class default_1 extends Listener_1.Listener {
    constructor() {
        super();
        this.name = "disconnect";
    }
    run(base, netID) {
        console.log("Peer", netID, "disconnected");
        let peer = base.cache.users.getSelf(netID);
        peer?.leaveWorld();
        peer?.saveToDatabase();
        base.cache.users.delete(netID);
        const filePath = 'number.txt';
        // Function to read and decrement a number in a file
        const decrementNumberInFile = (filePath) => {
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    console.error(`Error reading file ${filePath}:`, err);
                    return;
                }
                // Parse the data as an integer
                let currentNumber = parseInt(data, 10);
                // Check if the parsed value is a valid number
                if (!isNaN(currentNumber) && currentNumber > 0) {
                    // Decrement the number by 1
                    currentNumber -= 1;
                    // Write the updated number back to the file
                    fs.writeFile(filePath, currentNumber.toString(), 'utf8', (err) => {
                        if (err) {
                            console.error(`Error writing file ${filePath}:`, err);
                        }
                        else {
                            console.log(`File ${filePath} updated. New number:`, currentNumber);
                        }
                    });
                }
                else {
                    console.error(`File ${filePath} does not contain a valid number.`);
                }
            });
        };
        // Example usage: Decrement the number in "number.txt" by 1
        decrementNumberInFile(filePath);
    }
}
exports.default = default_1;
