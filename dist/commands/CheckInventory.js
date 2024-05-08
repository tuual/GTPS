"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const growtopia_js_1 = require("growtopia.js");
const Command_1 = require("../abstracts/Command");
const DialogBuilder_1 = require("../utils/builders/DialogBuilder");
const Constants_1 = require("../utils/Constants");
const quick_db_1 = require("quick.db");
const data = new quick_db_1.QuickDB;
class default_1 extends Command_1.Command {
    constructor() {
        super();
        this.opt = {
            name: "inv",
            description: "Start a new world event.",
            cooldown: 0,
            ratelimit: 1,
            category: "Developer",
            usage: "/inventory",
            example: ["/inventory"],
            permission: [Constants_1.Role.MOD, Constants_1.Role.ADMIN, Constants_1.Role.DEVELOPER]
        };
    }
    async execute(base, peer, text, args) {
        const pInv = peer.data.inventory?.items;
        const dialog = new DialogBuilder_1.DialogBuilder()
            .defaultColor()
            .addLabelWithIcon(`${peer.name}'s inventory`, "32", "small")
            .addSpacer("small")
            .addCustomBreak();
        const transformedArray = pInv.map((element) => {
            dialog.addButtonWithIcon(element.id, element.id, "", "staticBlueFrame", element.amount);
        });
        dialog.addCustomBreak();
        dialog.endDialog("endInv", "Cancel", "");
        peer.send(growtopia_js_1.Variant.from("OnDialogRequest", dialog.str()));
    }
}
exports.default = default_1;
