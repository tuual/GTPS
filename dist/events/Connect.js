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
const growtopia_js_1 = require("growtopia.js");
const Listener_1 = require("../abstracts/Listener");
const Peer_1 = require("../structures/Peer");
const fs = __importStar(require("fs"));
const quick_db_1 = require("quick.db");
const data = new quick_db_1.QuickDB;
class default_1 extends Listener_1.Listener {
    constructor() {
        super();
        this.name = "connect";
    }
    async run(base, netID) {
        console.log("Peer", netID, "connected.");
        const peer = new Peer_1.Peer(base, netID);
        const packet = growtopia_js_1.TextPacket.from(0x1);
        peer.send(packet);
        base.cache.users.setSelf(netID, peer.data);
        const filePath = 'number.txt';
        // Read the current number from the file
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading file:', err);
                return;
            }
            // Parse the data as an integer
            const currentNumber = parseInt(data, 10);
            // Check if the parsed value is a valid number
            if (!isNaN(currentNumber)) {
                // Increment the number by 1
                const updatedNumber = currentNumber + 1;
                // Write the updated number back to the file
                fs.writeFile(filePath, updatedNumber.toString(), 'utf8', (err) => {
                    if (err) {
                        console.error('Error writing file:', err);
                    }
                    else {
                        console.log('File updated. New number:', updatedNumber);
                    }
                });
            }
            else {
                console.error('File does not contain a valid number.');
            }
        });
        const time = new Date();
        data.set(`PlayerLastJoined_${peer.data.id_user}`, { user_id: peer.data.id_user, time: time.getDate() });
        console.log(time.getDate());
    }
}
exports.default = default_1;
