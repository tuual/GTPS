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
            name: "trade",
            description: "Warp to a world, using command.",
            cooldown: 1,
            ratelimit: 1,
            category: "Basic",
            usage: "/trade",
            example: ["/trade <player>"],
            permission: [Constants_1.Role.BASIC, Constants_1.Role.MOD, Constants_1.Role.DEVELOPER]
        };
    }
    async execute(base, peer, text, args) {
        const world = peer.hasWorld(peer.data.world);
        const targetPeer = (0, Utils_1.find)(base, base.cache.users, (user) => user.data.tankIDName.toLowerCase().includes(args[0].toLowerCase()));
        // Check for arguments
        if (!args[0] || !targetPeer)
            return peer.send(growtopia_js_1.Variant.from("OnConsoleMessage", "Player not found. Try again with a vaid name."));
        if (!world)
            return peer.send(growtopia_js_1.Variant.from("OnConsoleMessage", "You must be in a world to use this command."));
        // if(peer.data.world === targetPeer.data.world) return peer.send(Variant.from("OnConsoleMessage", "Hmm... something went wrong, could not find the player in the current world."))
        peer.send(growtopia_js_1.Variant.from("OnTextOverlay", "Sending trade request to " + targetPeer.name + "..."));
        peer.send(growtopia_js_1.Variant.from("OnStartTrade", targetPeer.data.tankIDName, targetPeer.data.netID));
    }
}
exports.default = default_1;
