"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const growtopia_js_1 = require("growtopia.js");
const Dialog_1 = require("../abstracts/Dialog");
class default_1 extends Dialog_1.Dialog {
    constructor() {
        super();
        this.config = {
            dialogName: "lock_edit"
        };
    }
    handle(base, peer, db, action) {
        const world = peer.hasWorld(peer.data.world);
        const newAdminsArray = [action.playerNetID];
        if (action.playerNetID) {
            if (action.playerNetID === peer.data.netID) {
                return peer.send(growtopia_js_1.Variant.from("OnTalkBubble", "You already have access!"));
            }
            const data = world?.data;
            // Assign the admins property to the variable
            data.admins = newAdminsArray;
            //world?.saveToDatabase(); // Save the world to the database
            // Send a chat message to notify the player
            peer.send(growtopia_js_1.Variant.from("OnConsoleMessage", "New admin added!"));
        }
    }
}
exports.default = default_1;
