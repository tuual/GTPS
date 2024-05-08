"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePlace = void 0;
const growtopia_js_1 = require("growtopia.js");
const Constants_1 = require("../utils/Constants");
const Tiles_1 = require("../utils/enums/Tiles");
const BlockPlacing_1 = require("./BlockPlacing");
/** Handle Place */
function handlePlace(tank, peer, base, world) {
    const tankData = tank.data;
    const pos = tankData.xPunch + tankData.yPunch * world.data.width;
    const block = world.data.blocks[pos];
    //prettier-ignore
    const isBg = base.items.metadata.items[tankData.info].type === Tiles_1.ActionTypes.BACKGROUND || base.items.metadata.items[tankData.info].type === Tiles_1.ActionTypes.SHEET_MUSIC;
    const placedItem = base.items.metadata.items.find((i) => i.id === tank.data?.info);
    //const itemMeta = base.items.metadata.items[block.fg || block.bg!];
    if (!placedItem || !placedItem.id)
        return;
    if (tankData.info === 18 || tankData.info === 32)
        return;
    if (block.fg === 242)
        return;
    const placedWL = world.data.blocks?.find((a) => a.fg === 242);
    if (placedWL?.fg && placedItem.id === 242) {
        return peer.send(growtopia_js_1.Variant.from("OnTalkBubble", peer.data.netID, `You can only place 1 \`9World Lock \`\`in a world!`), growtopia_js_1.Variant.from("OnConsoleMessage", `You can only place 1 \`9World Lock \`\`in a world!`));
    }
    if (world.data.owner) {
        if (world.data.owner.id !== peer.data.id_user) {
            if (peer.data.role !== Constants_1.Role.DEVELOPER) {
                return peer.send(growtopia_js_1.Variant.from({ netID: peer.data.netID }, "OnPlayPositioned", "audio/punch_locked.wav"));
            }
        }
    }
    if (placedItem.id === 242) {
        peer.everyPeer((pa) => {
            if (pa.data.world === peer.data.world && pa.data.world !== "EXIT")
                pa.send(growtopia_js_1.Variant.from("OnTalkBubble", peer.data.netID, `\`3[\`w${world.worldName} \`ohas been World Locked by ${peer.name}\`3]`), growtopia_js_1.Variant.from("OnConsoleMessage", `\`3[\`w${world.worldName} \`ohas been World Locked by ${peer.name}\`3]`), growtopia_js_1.Variant.from({ netID: peer.data.netID }, "OnPlayPositioned", "audio/use_lock.wav"));
            /*if(block.worldLock === true){
           return pa.send(Variant.from("OnTalkBubble", peer.data.netID, "You can only place 1 World Lock in a world!"))
            }*/
        });
    }
    if (placedItem.id === 8 ||
        placedItem.id === 6 ||
        placedItem.id === 1000 ||
        placedItem.id === 3760 ||
        placedItem.id === 7372) {
        if (peer.data.role !== Constants_1.Role.DEVELOPER && peer.data.role !== Constants_1.Role.ADMIN && peer.data.role !== Constants_1.Role.MOD) {
            return peer.send(growtopia_js_1.Variant.from("OnTalkBubble", peer.data.netID, "Can't place that block."), growtopia_js_1.Variant.from({ netID: peer.data.netID }, "OnPlayPositioned", "audio/punch_locked.wav"));
        }
    }
    if (block.fg === 2946) {
        block.dblockID = placedItem.id;
        if (placedItem.collisionType === 1) {
            removeItem(peer, tank, true);
            return (0, BlockPlacing_1.tileUpdate)(base, peer, Tiles_1.ActionTypes.DISPLAY_BLOCK, block, world);
        }
        (0, BlockPlacing_1.tileUpdate)(base, peer, Tiles_1.ActionTypes.DISPLAY_BLOCK, block, world);
    }
    const placed = (0, BlockPlacing_1.handleBlockPlacing)({
        actionType: placedItem.type,
        peer,
        world,
        block,
        id: placedItem.id,
        isBg,
        base
    });
    removeItem(peer, tank, placed);
    world.saveToCache();
    peer.saveToCache();
    return;
}
exports.handlePlace = handlePlace;
/*function removeItem(peer: Peer, tank: TankPacket, placed: boolean) {
  // prettier-ignore
  let invenItem = peer.data.inventory?.items.find((item) => item.id === tank.data?.info)!;
  if (placed) invenItem.amount = invenItem.amount! - 1;

  // Check if inventory amount is empty, then delete it.
  if (invenItem.amount <= 0) {
    // prettier-ignore
    peer.data.inventory!.items! = peer.data.inventory?.items.filter((i) => i.amount !== 0)!;
  }
  peer.inventory();
}*/
function removeItem(peer, tank, placed) {
    const tankInfo = tank.data?.info;
    if (!tankInfo)
        return;
    const inventory = peer.data.inventory;
    if (!inventory)
        return;
    const invenItemIndex = inventory.items.findIndex((item) => item.id === tankInfo);
    if (invenItemIndex === -1)
        return;
    const invenItem = inventory.items[invenItemIndex];
    if (placed)
        invenItem.amount--;
    if (invenItem.amount <= 0) {
        inventory.items.splice(invenItemIndex, 1);
    }
    peer.inventory();
}
