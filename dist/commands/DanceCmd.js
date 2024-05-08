"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const growtopia_js_1 = require("growtopia.js");
const Command_1 = require("../abstracts/Command");
const Constants_1 = require("../utils/Constants");
class default_1 extends Command_1.Command {
    constructor() {
        super();
        this.opt = {
            name: "dance",
            description: "dance",
            cooldown: 0,
            ratelimit: 1,
            category: "Basic",
            usage: "/dance",
            example: ["/dance"],
            permission: [Constants_1.Role.BASIC, Constants_1.Role.ADMIN, Constants_1.Role.DEVELOPER]
        };
    }
    async execute(base, peer, text, args) {
        peer.send(growtopia_js_1.Variant.from("OnAction", text));
    }
}
exports.default = default_1;
