"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const growtopia_js_1 = require("growtopia.js");
const Dialog_1 = require("../abstracts/Dialog");
const DialogBuilder_1 = require("../utils/builders/DialogBuilder");
const quick_db_1 = require("quick.db");
const data = new quick_db_1.QuickDB;
class default_1 extends Dialog_1.Dialog {
    constructor() {
        super();
        this.config = {
            dialogName: "FriendsDialog"
        };
    }
    async handle(base, peer, db, 
    // world: World, 
    action) {
        const friends = await data.get(`Friend_${peer.data.tankIDName}`) || [];
        if (action.buttonClicked === "friendsList") {
            if (Array.isArray(friends)) {
                const numberOfFriends = friends.length;
                let g;
                if (numberOfFriends < 1 || !numberOfFriends)
                    g = 0;
                const dialog = new DialogBuilder_1.DialogBuilder()
                    .defaultColor()
                    .addLabelWithIcon(`0 of ${numberOfFriends || g} Friends Online`, "1366", "big")
                    .endDialog("close", "", "Close")
                    .addSpacer("big");
                if (Array.isArray(friends)) {
                    for (const friend of friends) {
                        const friendTankIDName = friend.data.tankIDName;
                        const targetPeer = base.cache.users.findPeer((p) => p.data.tankIDName === friendTankIDName);
                        if (targetPeer) {
                            // console.log(friendTankIDName);
                            dialog.addButton(friendTankIDName, `${friendTankIDName} (Status: \`2Online\`0)`);
                        }
                        // Do something with the friend data
                    }
                }
                else {
                    dialog.addSmallText("Such a lonely person, get a friend by doing /addfriend <player name>.");
                }
                dialog.addSpacer("big");
                dialog.addQuickExit();
                dialog.addButton("friends_settings", "Friends Settings");
                dialog.addButton("offline", "Show offline");
                dialog.endDialog("Friends1", "", "Close");
                peer.send(growtopia_js_1.Variant.from({ delay: 100 }, "OnDialogRequest", dialog.str()));
            }
        }
    }
}
exports.default = default_1;
