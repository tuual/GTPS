"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Action_1 = require("../abstracts/Action");
const DialogBuilder_1 = require("../utils/builders/DialogBuilder");
const growtopia_js_1 = require("growtopia.js");
class default_1 extends Action_1.Action {
    constructor() {
        super();
        this.config = {
            eventName: "friends"
        };
    }
    async handle(base, peer, db, action) {
        //let getGuild = await db.getGuild(undefined as any, peer.data.tankIDName);
        let dialog = new DialogBuilder_1.DialogBuilder()
            .defaultColor()
            .addLabelWithIcon("Social Portal", "1366", "big")
            .addButton("friendsList", "Show Friends")
            // if(getGuild){
            //  dialog.addButton("GM", "Show Guild Members(`2Coming soon!`0)")
            //  dialog.addButton("GC", "Guild Challenge(`2Coming soon!`0)")
            //  dialog.addButton("top_players", "Show `9Top Players(`2Coming soon!`0)")
            //   }else {
            .addButton("CG", "Create Guild")
            //   }
            .addButton("top_players", "Show `9Top Players(`2Coming soon!`0)")
            .endDialog("FriendsDialog", "Close", "")
            .addQuickExit();
        //.str();
        peer.send(growtopia_js_1.Variant.from({ delay: 100 }, "OnDialogRequest", dialog.str()));
    }
}
exports.default = default_1;
