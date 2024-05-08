"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const growtopia_js_1 = require("growtopia.js");
const Action_1 = require("../abstracts/Action");
const DialogBuilder_1 = require("../utils/builders/DialogBuilder");
const quick_db_1 = require("quick.db");
const data = new quick_db_1.QuickDB;
const fs = __importStar(require("fs"));
class default_1 extends Action_1.Action {
    constructor() {
        super();
        this.config = {
            eventName: "enter_game"
        };
    }
    async handle(base, peer, db, action) {
        let filePath = 'number.txt';
        const carnival = await data.get(`Carnival`);
        const GemEvnt = await data.get(`GemEvent`);
        const Gems = await data.get(`GemEventGems`);
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error(`Error reading file ${filePath}:`, err);
                return;
            }
            //console.log(`File contents of ${filePath}:`);
            //console.log(data);
            // Carnival Message
            const tes = new DialogBuilder_1.DialogBuilder()
                .defaultColor()
                .addLabelWithIcon("Hello", "1000", "big")
                .addSpacer("small")
                .addTextBox("Welcome to GrowServer")
                .raw("add_image_button||interface/large/news_banner.rttex|bannerlayout|||\n")
                .addQuickExit()
                .endDialog("gazzette_end", "Cancel", "Ok")
                .str();
            peer.send(growtopia_js_1.Variant.from("OnRequestWorldSelectMenu", "add_filter|\nadd_heading|Top Worlds|\nadd_floater|wotd_world|START|0|0.5|2147418367|"), growtopia_js_1.Variant.from("OnConsoleMessage", `Welcome! ${peer.name} Where would you like to go? ( online)`), growtopia_js_1.Variant.from({ delay: 100 }, "OnDialogRequest", tes));
            if (carnival) {
                peer.send(growtopia_js_1.Variant.from("OnRequestWorldSelectMenu", "add_filter|\nadd_heading|Top Worlds|\nadd_floater|wotd_world|START|0|0.5|2147418367|"), growtopia_js_1.Variant.from("OnConsoleMessage", "`2Carnival has come to town`0, visit the world `9CARNIVAL`0, try your luck at winning one of the ringmaster's fabulous rings!"));
            }
            if (GemEvnt) {
                peer.send(growtopia_js_1.Variant.from("OnRequestWorldSelectMenu", "add_filter|\nadd_heading|Top Worlds|\nadd_floater|wotd_world|START|0|0.5|2147418367|"), growtopia_js_1.Variant.from("OnConsoleMessage", `\`2x${Gems} Gem Event is ongoing, \`5Try get as much gems as you can!`));
            }
        });
    }
}
exports.default = default_1;
