"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSaveAll = exports.decrypt = exports.encrypt = exports.hashItemsDat = exports.find = exports.parseAction = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
const World_1 = require("../structures/World");
function parseAction(chunk) {
    let data = {};
    chunk[chunk.length - 1] = 0;
    let str = chunk.toString("utf-8", 4);
    const lines = str.split("\n");
    lines.forEach((line) => {
        if (line.startsWith("|"))
            line = line.slice(1);
        const info = line.split("|");
        let key = info[0];
        let val = info[1];
        if (key && val) {
            if (val.endsWith("\x00"))
                val = val.slice(0, -1);
            data[key] = val;
        }
    });
    return data;
}
exports.parseAction = parseAction;
function find(base, users, func) {
    for (const item of users.values()) {
        const peer = users.getSelf(item.netID);
        if (func(peer)) {
            return peer;
        }
    }
    return undefined;
}
exports.find = find;
function hashItemsDat(file) {
    let hash = 0x55555555;
    file.forEach((x) => (hash = (hash >>> 27) + (hash << 5) + x));
    return hash >>> 0;
}
exports.hashItemsDat = hashItemsDat;
function encrypt(data) {
    return crypto_js_1.default.AES.encrypt(data, process.env.ENCRYPT_SECRET).toString();
}
exports.encrypt = encrypt;
function decrypt(data) {
    return crypto_js_1.default.AES.decrypt(data, process.env.ENCRYPT_SECRET).toString(crypto_js_1.default.enc.Utf8);
}
exports.decrypt = decrypt;
function handleSaveAll(server, dcAll = false) {
    server.log.warn(`Saving ${server.cache.users.size} peers & ${server.cache.worlds.size} worlds.`);
    const saveWorlds = () => {
        if (server.cache.worlds.size === 0)
            process.exit();
        else {
            let o = 0;
            server.cache.worlds.forEach(async (wrld) => {
                const world = new World_1.World(server, wrld.name);
                if (typeof world.worldName === "string")
                    await world.saveToDatabase();
                else
                    server.log.warn(`Oh no there's undefined (${o}) world, skipping..`);
                o += 1;
                if (o === server.cache.worlds.size)
                    process.exit();
            });
        }
    };
    if (server.cache.users.size === 0)
        process.exit();
    else {
        let i = 0;
        server.cache.users.forEach(async (peer) => {
            const player = server.cache.users.getSelf(peer.netID);
            await player.saveToDatabase();
            if (dcAll) {
                player.disconnect("now");
            }
            else {
                // send onconsolemessage for auto saving
            }
            i += 1;
            if (i === server.cache.users.size)
                saveWorlds();
        });
    }
}
exports.handleSaveAll = handleSaveAll;
