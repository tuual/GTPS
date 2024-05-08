"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Action_1 = require("../abstracts/Action");
const DialogBuilder_1 = require("../utils/builders/DialogBuilder");
const growtopia_js_1 = require("growtopia.js");
const Constants_1 = require("../utils/Constants");
class default_1 extends Action_1.Action {
    constructor() {
        super();
        this.config = {
            eventName: "wrench"
        };
    }
    handle(base, peer, db, action) {
        let world = peer.hasWorld(peer.data.world);
        if (action.action === "wrench" && peer.data.netID === action.netID) { // Updates
            let dialog = new DialogBuilder_1.DialogBuilder()
                .defaultColor()
                .addLabelWithIcon(peer.name, "32", "big")
                .addSpacer("small")
                .addButton("trade", "Trade(Coming soon!)")
                //.raw("add_player_picker|playerNetID|`wAdd``\n")
                .addSpacer("small")
                .addSmallText("Level: `2Coming soon!")
                .addSpacer("small");
            if (peer.data.role === Constants_1.Role.DEVELOPER || peer.data.role === Constants_1.Role.ADMIN || peer.data.role === Constants_1.Role.MOD) {
                dialog.addSmallText("Role: " + peer.data.role);
                dialog.addSmallText("`3Player last visit: Coming soon!");
                dialog.addSmallText(`My NetID: ${peer.data.netID}`);
            }
            dialog.addQuickExit();
            //.str();
            peer.send(growtopia_js_1.Variant.from({ delay: 100 }, "OnDialogRequest", dialog.str()));
        }
        else {
            let dialog = new DialogBuilder_1.DialogBuilder()
                .defaultColor()
                .addLabelWithIcon(peer.data.tankIDName, "32", "big")
                .addSmallText("Level: 1  (0/1000000000) [`2Coming soon!]")
                .raw("\nadd_progress_bar|Level 1 ")
                .addSpacer("small")
                //.addButton("account_s", "Account Settings")
                //.addButton("title", "Title") 
                .addSpacer("small")
                .addCustomBreak()
                .addCustomButton("test1", "interface/large/gui_wrench_goals_quests.rttex", { width: 404, height: 324 })
                .addCustomButton("test2", "interface/large/gui_wrench_personalize_profile.rttex", { width: 404, height: 324 })
                .addCustomButton("test3", "interface/large/gui_wrench_growmojis.rttex", { width: 404, height: 324 })
                .addCustomButton("test4", "interface/large/gui_wrench_online_status_1green.rttex", { width: 404, height: 324 })
                .addCustomButton("test5", "interface/large/gui_wrench_my_worlds.rttex", { width: 404, height: 324 })
                .addCustomButton("test6", "interface/large/gui_wrench_notebook.rttex", { width: 404, height: 324 })
                .addCustomButton("test7", "interface/large/gui_wrench_title.rttex", { width: 404, height: 324 })
                .addCustomButton("test8", "interface/large/gui_wrench_trade.rttex", { width: 404, height: 324 })
                .addCustomBreak()
                .addSpacer("small")
                .addSmallText(`Active effects: Coming soon!`)
                .addSpacer("small")
                .addSmallText(`You have ${peer.data.inventory?.items.length} items`)
                .addSmallText(`Current world: ${peer.data.world} (${peer.data.x}, ${peer.data.y}) (${world?.data.playerCount} person) Total time played: 0 hours`)
                .addQuickExit()
                .endDialog("profile_end", "", "Continue")
                .str();
            peer.send(growtopia_js_1.Variant.from({ delay: 100 }, "OnDialogRequest", dialog));
        }
    }
}
exports.default = default_1;
