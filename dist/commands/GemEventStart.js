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
            name: "gemevent",
            description: "Free gems!",
            cooldown: 0,
            ratelimit: 1,
            category: "Developer",
            usage: "/gemevent",
            example: ["/gemevent"],
            permission: [Constants_1.Role.DEVELOPER]
        };
    }
    async execute(base, peer, text, args) {
        const GemEvnt = await data.get(`GemEvent`);
        if (!args[0])
            return peer.send(growtopia_js_1.Variant.from("OnConsoleMessage", "Please enter a number!"));
        if (GemEvnt)
            return peer.send(growtopia_js_1.Variant.from("OnConsoleMessage", "Event has already started! `bEnd the event to start a new one!"));
        peer.everyPeer((p) => {
            p.send(growtopia_js_1.Variant.from("OnConsoleMessage", `x${args[0]} \`2Gem Event has began! \`9Happy farming everyone!`));
            p.send(growtopia_js_1.Variant.from("OnAddNotification", "interface/atomic_button.rttex", `x${args[0]} \`2Gem Event has began!\``, "audio/hub_open.wav"));
            data.set(`GemEvent`, true);
            data.set(`GemEventGems`, parseInt(args[0]));
        });
    }
}
exports.default = default_1;
