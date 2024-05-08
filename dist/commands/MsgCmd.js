"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const growtopia_js_1 = require("growtopia.js");
const Command_1 = require("../abstracts/Command");
const Constants_1 = require("../utils/Constants");
const Utils_1 = require("../utils/Utils");
class default_1 extends Command_1.Command {
    constructor() {
        super();
        this.opt = {
            name: "msg",
            description: "msg",
            cooldown: 1,
            ratelimit: 1,
            category: "Basic",
            usage: "/msg",
            example: ["/msg"],
            permission: [Constants_1.Role.BASIC, Constants_1.Role.ADMIN, Constants_1.Role.DEVELOPER]
        };
    }
    async execute(base, peer, text, args) {
        const targetPeer = (0, Utils_1.find)(base, base.cache.users, (user) => user.data.tankIDName.toLowerCase().includes(args[0].toLowerCase()));
        const cleanedString = args.join(" ").slice(targetPeer?.data.tankIDName.length || 0);
        if (!targetPeer || targetPeer === null) {
            peer.send(growtopia_js_1.Variant.from("OnConsoleMessage", "User not found! (User must be online to use this command.)"));
            return;
        }
        targetPeer.send(growtopia_js_1.Variant.from("OnConsoleMessage", `[MSG] >> from (${peer.name}) in (${peer.data.world}) > ${cleanedString}`));
    }
}
exports.default = default_1;
