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
            name: "role",
            description: "Role giver",
            cooldown: 0,
            ratelimit: 1,
            category: "Basic",
            usage: "/role",
            example: ["/role <player role>"],
            permission: [Constants_1.Role.BASIC, Constants_1.Role.ADMIN, Constants_1.Role.MOD, Constants_1.Role.DEVELOPER]
        };
    }
    async execute(base, peer, text, args, db) {
        const targetPeer = (0, Utils_1.find)(base, base.cache.users, (user) => user.data.tankIDName.toLowerCase().includes(args[0].toLowerCase()));
        if (!args[1])
            return peer.send(growtopia_js_1.Variant.from("OnConsoleMessage", "Invalid argument."));
        if (parseInt(args[1]) > 4)
            return peer.send(growtopia_js_1.Variant.from("OnConsoleMessage", "Role is 1,2,3,4"));
        if (!targetPeer) {
            peer.send(growtopia_js_1.Variant.from("OnConsoleMessage", "User not found! (User must be online to use this command.)"));
            return;
        }
        let role = "";
        if (args[1] === "1")
            role = Constants_1.Role.DEVELOPER;
        if (args[1] === "2")
            role = Constants_1.Role.BASIC;
        if (args[1] === "3")
            role = Constants_1.Role.MOD;
        if (args[1] === "4")
            role = Constants_1.Role.ADMIN;
        //data.set(`Role_${targetPeer.name}`, role)
        db.updateRole(targetPeer.data.tankIDName, role);
        targetPeer.data.role = role;
        targetPeer.send(growtopia_js_1.Variant.from("OnConsoleMessage", `[ROLE] >> from (${peer.name}) in (${peer.data.world}) > ` + args[1]));
        targetPeer.send(growtopia_js_1.Variant.from("OnTextOverlay", "`4Please wait... saving data and setting role..."));
        targetPeer.saveToCache();
        targetPeer.saveToDatabase().then(() => {
            targetPeer.send(growtopia_js_1.Variant.from("OnTextOverlay", "`2Received`` " + role + "role!"));
        });
    }
}
exports.default = default_1;
