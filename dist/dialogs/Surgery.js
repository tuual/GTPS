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
            dialogName: "surgery"
        };
    }
    handle(base, peer, db, action) {
        // Set
        let onSurgery = false;
        let finished = false;
        function shuffleArray(array) {
            if (array.length === 0) {
                return undefined; // Return undefined for an empty array
            }
            const randomIndex = Math.floor(Math.random() * array.length);
            return array[randomIndex];
        }
        // Example usage:
        const originalArray = ["Patient broke his leg.", "Patient has flu.", "Patient ate a world lock!"];
        const pulseArray = ["`2Strong", "`1Steady", "`4Weak"];
        const statusArray = ["`4Awake", "`2Unconscious", "`8Coming too..."];
        const tempArray = ["`298.6", "`4100.6", "`290.6", "`4103.6", "`4106.6"];
        const OperationArray = ["`8Unclean", "`2Clean", "`1Not sanitized", "`4Unsanitary"];
        const patient = shuffleArray(originalArray);
        const pulse = shuffleArray(pulseArray);
        const status = shuffleArray(statusArray);
        const temp = shuffleArray(tempArray);
        const Operation = shuffleArray(OperationArray);
        if (action.buttonClicked === "button_ok") {
            let onSurgery = true;
            // 1
            console.log(pulse);
            console.log(patient);
            const dialog = new DialogBuilder_1.DialogBuilder()
                .defaultColor()
                .addLabelWithIcon("Surg-E Robot", "18", "big")
                .addSmallText(`\`4The patient has not been diagnosed!`)
                .addSmallText(`Pulse: \`1${pulse}   \`0Status: \`4Awake`)
                .addSmallText("Temp: `298.6\`0  Operation site: `8Unclean")
                .addSmallText("Incisions: `10")
                .addSpacer("big")
                .addCustomBreak()
                .addButtonWithIcon(1258, 1258, "", "staticBlueFrame") // sponge
                .addButtonWithIcon(1260, 1260, "", "staticBlueFrame") // scalpe
                .addButtonWithIcon(1270, 1270, "", "staticBlueFrame") //  stitches
                .addButtonWithIcon(1266, 1266, "", "staticBlueFrame") // anti-boi
                .addButtonWithIcon(1264, 1264, "", "staticBlueFrame") // anti-spectic
                .addButtonWithIcon(4316, 4316, "", "staticBlueFrame") // unltrasound
                .addCustomBreak()
                .addButtonWithIcon(4320, 4320, "", "staticBlueFrame") // tray
                .addButtonWithIcon(1262, 1262, "", "staticBlueFrame") // anes
                .addButtonWithIcon(4320, 4320, "", "staticBlueFrame") // tray
                .addButtonWithIcon(4320, 4320, "", "staticBlueFrame") // tray
                .addButtonWithIcon(4320, 4320, "", "staticBlueFrame") // tray
                .addButtonWithIcon(4310, 4310, "", "staticBlueFrame") // trans
                .addCustomBreak()
                .addSpacer("small")
                .endDialog("surgery_end", "", "Give up!");
            peer.send(growtopia_js_1.Variant.from("OnDialogRequest", dialog.str()));
        }
    }
}
exports.default = default_1;
