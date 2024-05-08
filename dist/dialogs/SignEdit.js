"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Dialog_1 = require("../abstracts/Dialog");
const BlockPlacing_1 = require("../tanks/BlockPlacing");
class default_1 extends Dialog_1.Dialog {
    constructor() {
        super();
        this.config = {
            dialogName: "sign_edit"
        };
    }
    handle(base, peer, db, action) {
        const world = peer.hasWorld(peer.data.world);
        const pos = parseInt(action.tilex) + parseInt(action.tiley) * world?.data.width;
        const block = world?.data.blocks[pos];
        const itemMeta = base.items.metadata.items.find((i) => i.id === parseInt(action.itemID));
        if (world?.data.owner) {
            if (world.data.owner.id !== peer.data.id_user)
                return;
        }
        block.sign.label = action.label || "";
        (0, BlockPlacing_1.tileUpdate)(base, peer, itemMeta?.type, block, world);
    }
}
exports.default = default_1;
