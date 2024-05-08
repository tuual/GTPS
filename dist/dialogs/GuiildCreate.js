"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const growtopia_js_1 = require("growtopia.js");
const Dialog_1 = require("../abstracts/Dialog");
const DialogBuilder_1 = require("../utils/builders/DialogBuilder");
class default_1 extends Dialog_1.Dialog {
    constructor() {
        super();
        this.config = {
            dialogName: "FriendsDialog"
        };
    }
    handle(base, peer, db, action) {
        if (action.buttonClicked === "CG") {
            const dialog1 = new DialogBuilder_1.DialogBuilder()
                .defaultColor()
                .addLabelWithIcon("GrowAsia Guild Creation", 5814, "big")
                .addSmallText("[`4BETA``] To create guild, fill all the empty fields.")
                .addSmallText("`4Disclaimer``: Guild creation is currently in beta.")
                .addSmallText("`4Inappropriate guild creation will result in a ban.")
                .addSpacer("small")
                .addInputBox("guild_name", "Guild Name:", "", 10)
                .addSpacer("small")
                .addInputBox("guild_statement", "Guild Statement:", "", 30)
                .addSpacer("small")
                .addButton("create", "Create!")
                .endDialog("CGDialog", "", "Close")
                .addQuickExit();
            //.str();
            peer.send(growtopia_js_1.Variant.from("OnDialogRequest", dialog1.str()));
        }
    }
}
exports.default = default_1;
