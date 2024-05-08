"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const growtopia_js_1 = require("growtopia.js");
const Command_1 = require("../abstracts/Command");
const Constants_1 = require("../utils/Constants");
class default_1 extends Command_1.Command {
    constructor() {
        super();
        this.opt = {
            name: "invis",
            description: "Super broadcast to players online.",
            cooldown: 0,
            ratelimit: 1,
            category: "Basic",
            usage: "/invis",
            example: ["/invis"],
            permission: [Constants_1.Role.BASIC, Constants_1.Role.ADMIN, Constants_1.Role.DEVELOPER]
        };
    }
    async execute(base, peer, text, args) {
        const isInvis = true;
        const tank = growtopia_js_1.TankPacket.from({
            type: 20,
            state: 0x8,
            packetType: 17
        });
        peer.send(tank);
        const world = peer.hasWorld(peer.data.world);
        peer.send(growtopia_js_1.Variant.from({ netID: peer.data.netID }, "OnInvis", 1));
    }
}
exports.default = default_1;
