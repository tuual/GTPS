"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tileUpdate = exports.handleBlockPlacing = void 0;
const growtopia_js_1 = require("growtopia.js");
const TileExtra_1 = require("../structures/TileExtra");
const TankTypes_1 = require("../utils/enums/TankTypes");
const Tiles_1 = require("../utils/enums/Tiles");
function handleBlockPlacing(p) {
    switch (p.actionType) {
        case Tiles_1.ActionTypes.SHEET_MUSIC:
        case Tiles_1.ActionTypes.BEDROCK:
        case Tiles_1.ActionTypes.LAVA:
        case Tiles_1.ActionTypes.DEADLY_BLOCK:
        case Tiles_1.ActionTypes.XENONITE:
        case Tiles_1.ActionTypes.WEATHER_SPECIAL:
        case Tiles_1.ActionTypes.CHECKPOINT:
        case Tiles_1.ActionTypes.BOOMBOX:
        case Tiles_1.ActionTypes.FOREGROUND:
        case Tiles_1.ActionTypes.DICE:
        case Tiles_1.ActionTypes.ICE:
        case Tiles_1.ActionTypes.VENDING_MACHINE:
        case Tiles_1.ActionTypes.PLATFORM:
        case Tiles_1.ActionTypes.AUTO_ACTION_HARVEST:
        case Tiles_1.ActionTypes.PROVIDER:
        case Tiles_1.ActionTypes.AUTO_ACTION_HARVEST_SUCK:
        case Tiles_1.ActionTypes.ITEM_SUCKER:
        case Tiles_1.ActionTypes.FOSSIL:
        case Tiles_1.ActionTypes.SFX_WITH_EXTRA_FRAME:
        case Tiles_1.ActionTypes.BACKGROUND: {
            p.world.place({
                peer: p.peer,
                x: p.block.x,
                y: p.block.y,
                isBg: p.isBg,
                id: p.id
            });
            tileUpdate(p.base, p.peer, Tiles_1.ActionTypes.FOREGROUND, p.block, p.world); // Fix re-enter
            return true;
            break;
        }
        case Tiles_1.ActionTypes.PORTAL:
        case Tiles_1.ActionTypes.DOOR:
        case Tiles_1.ActionTypes.MAIN_DOOR: {
            p.block.door = { label: "", destination: "", id: "", locked: false };
            p.world.place({
                peer: p.peer,
                x: p.block.x,
                y: p.block.y,
                isBg: p.isBg,
                id: p.id
            });
            return true;
            break;
        }
        case Tiles_1.ActionTypes.SIGN: {
            p.block.sign = { label: "" };
            p.world.place({
                peer: p.peer,
                x: p.block.x,
                y: p.block.y,
                isBg: p.isBg,
                id: p.id
            });
            return true;
            break;
        }
        case Tiles_1.ActionTypes.HEART_MONITOR: {
            p.block.heartMonitor = {
                name: p.peer.data.tankIDName,
                user_id: parseInt(p.peer.data.id_user)
            };
            p.world.place({
                peer: p.peer,
                x: p.block.x,
                y: p.block.y,
                isBg: p.isBg,
                id: p.id
            });
            tileUpdate(p.base, p.peer, p.actionType, p.block, p.world);
            return true;
            break;
        }
        case Tiles_1.ActionTypes.LOCK: {
            if (p.id !== 242 && p.id !== 202 && p.id !== 5814)
                return false;
            if (p.block.worldLock === true) {
                p.peer.send(growtopia_js_1.Variant.from("OnTalkBubble", p.peer.data.netID, "You can only place 1 World Lock in a world!"));
                return true;
            }
            else {
                const locked = p.block.worldLock = true;
                if (!p.block.lock) {
                    p.block.lock = {
                        ownerUserID: p.peer.data.id_user
                    };
                }
                p.world.data.owner = {
                    id: p.peer.data.id_user,
                    name: p.peer.data.tankIDName,
                    displayName: p.peer.name
                };
                p.world.place({
                    peer: p.peer,
                    x: p.block.x,
                    y: p.block.y,
                    isBg: p.isBg,
                    id: p.id
                });
                tileUpdate(p.base, p.peer, p.actionType, p.block, p.world);
                return true;
                break;
            }
        }
        case Tiles_1.ActionTypes.DISPLAY_BLOCK: {
            p.block.dblockID = 0;
            p.world.place({
                peer: p.peer,
                x: p.block.x,
                y: p.block.y,
                isBg: p.isBg,
                id: p.id
            });
            tileUpdate(p.base, p.peer, p.actionType, p.block, p.world);
            return true;
            break;
        }
        case Tiles_1.ActionTypes.SEED: {
            if (p.block.fg !== 0)
                return false;
            const item = p.base.items.metadata.items[p.id];
            const fruitCount = Math.floor(Math.random() * 10 * (1 - item.rarity / 1000)) + 1;
            const now = Date.now();
            p.block.tree = {
                fruit: p.id - 1,
                fruitCount: fruitCount,
                fullyGrownAt: now + item.growTime * 1000,
                plantedAt: now
            };
            p.world.place({
                peer: p.peer,
                x: p.block.x,
                y: p.block.y,
                id: p.id,
                fruit: fruitCount > 4 ? 4 : fruitCount
            });
            tileUpdate(p.base, p.peer, p.actionType, p.block, p.world);
            return true;
            break;
        }
        default: {
            console.log("Unknown block placing", { actionType: p.actionType, block: p.block });
            return false;
            break;
        }
    }
}
exports.handleBlockPlacing = handleBlockPlacing;
function tileUpdate(base, peer, actionType, block, world) {
    peer.everyPeer((p) => {
        if (p.data.world === peer.data.world && p.data.world !== "EXIT") {
            p.send(growtopia_js_1.TankPacket.from({
                type: TankTypes_1.TankTypes.TILE_UPDATE,
                xPunch: block.x,
                yPunch: block.y,
                data: () => (0, TileExtra_1.HandleTile)(base, block, world, actionType)
            }));
        }
    });
}
exports.tileUpdate = tileUpdate;
