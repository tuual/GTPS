"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const growtopia_js_1 = require("growtopia.js");
const Command_1 = require("../abstracts/Command");
const Constants_1 = require("../utils/Constants");
const quick_db_1 = require("quick.db");
const data = new quick_db_1.QuickDB;
class default_1 extends Command_1.Command {
    constructor() {
        super();
        this.opt = {
            name: "event",
            description: "Start a new world event.",
            cooldown: 0,
            ratelimit: 1,
            category: "Basic",
            usage: "/event",
            example: ["/event"],
            permission: [Constants_1.Role.BASIC, Constants_1.Role.ADMIN, Constants_1.Role.DEVELOPER]
        };
    }
    async execute(base, peer, text, args) {
        let world = peer.hasWorld(peer.data.world);
        peer.everyPeer((p) => {
            peer.send(growtopia_js_1.Variant.from("OnTextOverlay", "`2Starting World Event!"));
            if (p.data.world === peer.data.world) {
                p.send(growtopia_js_1.Variant.from("OnAddNotification", "", "`2Beautiful Crystal:`` `wYou have 30 seconds to find and grab the `6Crystal Block Seed."));
                world.drop(peer, p.data.x / world?.data.playerCount * 3, p.data.y / 3, 263, 1);
                //data.set(`onEvent_${peer.data.world}`, true)
            }
        });
    }
}
exports.default = default_1;
