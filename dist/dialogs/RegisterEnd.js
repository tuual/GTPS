"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const growtopia_js_1 = require("growtopia.js");
const Dialog_1 = require("../abstracts/Dialog");
const quick_db_1 = require("quick.db");
const data = new quick_db_1.QuickDB;
class default_1 extends Dialog_1.Dialog {
    constructor() {
        super();
        this.config = {
            dialogName: "register_end"
        };
    }
    async handle(base, peer, db, action) {
        let checkuser = await db.getUser(action.register_name);
        if (action.register_name.length < 3 || null) {
            return peer.send(growtopia_js_1.Variant.from("OnConsoleMessage", "`4GrowID: Too short"));
        }
        else if (action.register_password.length < 3 || null) {
            return peer.send(growtopia_js_1.Variant.from("OnConsoleMessage", "`4Password: Too short"));
        }
        else if (checkuser?.name.toLocaleLowerCase(action.register_name)) {
            console.log('checkuser?.name:', checkuser?.name);
            console.log('action.register_name:', action.register_name);
            return peer.send(growtopia_js_1.Variant.from("OnConsoleMessage", "`4GrowID: Already registered"));
        }
        else {
            db.createUser(action.register_name, action.register_password);
            return peer.send(growtopia_js_1.Variant.from("OnConsoleMessage", "`2Successfully registered! Re-log required."));
        }
    }
}
exports.default = default_1;
