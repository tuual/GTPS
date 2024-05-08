"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const growtopia_js_1 = require("growtopia.js");
const Command_1 = require("../abstracts/Command");
const Constants_1 = require("../utils/Constants");
const Utils_1 = require("../utils/Utils");
const quick_db_1 = require("quick.db");
const data = new quick_db_1.QuickDB;
class default_1 extends Command_1.Command {
    constructor() {
        super();
        this.opt = {
            name: "addfriend",
            description: "Add friend",
            cooldown: 0,
            ratelimit: 1,
            category: "Basic",
            usage: "/addfriend",
            example: ["/addfriend <player name>"],
            permission: [Constants_1.Role.BASIC, Constants_1.Role.ADMIN, Constants_1.Role.MOD, Constants_1.Role.DEVELOPER]
        };
    }
    async execute(base, peer, text, args) {
        const targetPeers = (0, Utils_1.find)(base, base.cache.users, (user) => user.data.tankIDName.toLowerCase().includes(args[0].toLowerCase()));
        const targetPeer = {
            data: {
                tankIDName: targetPeers?.data.tankIDName,
                // Other properties of targetPeer
            },
        };
        if (!targetPeers)
            return peer.send(growtopia_js_1.Variant.from("OnConsoleMessage", "User not found! (User must be online to use this command.)"));
        // Fetch the array from the database
        const existingArray = await data.get(`Friend_${targetPeer.data.tankIDName}`) || [];
        // Add an element (in this case, targetPeer) to the array
        existingArray.push(targetPeer);
        // Set the modified array back in the database
        peer.send(growtopia_js_1.Variant.from("OnTalkBuble", `Waiting for ${targetPeer.data.tankIDName} to accept the friend request...`));
        data.set(`Friend_${targetPeer.data.tankIDName}`, existingArray);
        const tankIDName = targetPeer.data.tankIDName;
        console.log(tankIDName);
    }
}
exports.default = default_1;
