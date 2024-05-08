import { Action } from "../abstracts/Action";
import { ActionTypes, Options, Flags, ExtraTypes } from "../utils/enums/Tiles";
import { Block } from "../types/world";
import { World } from "./World";
import { BaseServer } from "./BaseServer";
import { find } from "../utils/Utils";

export function HandleTile(
  base: BaseServer,
  block: Block,
  world: World,
  actionType?: number
): Buffer {
  let buf: Buffer;
  const lockPos =
    block.lock && !block.lock.isOwner
      ? block.lock.ownerX! + block.lock.ownerY! * world.data.width!
      : 0;

  switch (actionType) {
    case ActionTypes.PORTAL:
    case ActionTypes.DOOR:
    case ActionTypes.MAIN_DOOR: {
      const label = block.door?.label || "";
      buf = Buffer.alloc(12 + label.length);

      buf.writeUInt32LE(block.fg! | (block.bg! << 16));
      buf.writeUint16LE(lockPos, 4);
      buf.writeUint16LE(Flags.FLAGS_TILEEXTRA, 6);

      buf.writeUint8(ExtraTypes.DOOR, 8);
      buf.writeUint16LE(label.length, 9);
      buf.write(label, 11);
      // first param locked/not (0x8/0x0)
      buf.writeUint8(0x0, 11 + label.length);

      return buf;
    }

    case ActionTypes.SIGN: {
      let flag = 0x0;
      const label = block.sign?.label || "";
      buf = Buffer.alloc(15 + label.length);

      if (block.rotatedLeft) flag |= Flags.FLAGS_ROTATED_LEFT;

      buf.writeUInt32LE(block.fg! | (block.bg! << 16));
      buf.writeUint16LE(lockPos, 4);
      buf.writeUint16LE(Flags.FLAGS_TILEEXTRA, 6);

      buf.writeUint8(ExtraTypes.SIGN, 8);
      buf.writeUint16LE(label.length, 9);
      buf.write(label, 11);
      buf.writeInt32LE(-1, 11 + label.length);

      return buf;
    }

    case ActionTypes.HEART_MONITOR: {
      // ET ID ID ID ID NL NL <name>

      const name = block.heartMonitor?.name || "";
      const id = block.heartMonitor?.user_id || 0;
      let flag = 0x0;

      // Check if the peer offline/online
      const targetPeer = base.cache.users.findPeer((p) => p.data.id_user === id);

      if (targetPeer) flag |= Flags.FLAGS_OPEN;
      if (block.rotatedLeft) flag |= Flags.FLAGS_ROTATED_LEFT;

      buf = Buffer.alloc(15 + name.length);

      buf.writeUInt32LE(block.fg! | (block.bg! << 16));
      buf.writeUint16LE(lockPos, 4);
      buf.writeUint16LE(flag, 6);

      buf.writeUint8(ExtraTypes.HEART_MONITOR, 8);
      buf.writeUint32LE(id, 9);
      buf.writeUint16LE(name.length, 13);
      buf.write(name, 15);

      return buf;
    }

    case ActionTypes.DISPLAY_BLOCK: {
      buf = Buffer.alloc(13);

      buf.writeUInt32LE(block.fg! | (block.bg! << 16));
      buf.writeUint16LE(0x0, 4);
      buf.writeUint16LE(0x0, 6);

      buf.writeUint8(ExtraTypes.DISPLAY_BLOCK, 8);
      buf.writeUint32LE(block.dblockID!, 9);

      return buf;
    }

    case ActionTypes.LOCK: {
      const owner = (block.lock ? block.lock.ownerUserID : world.data.owner?.id) as number;

      // 0 = admincount
      buf = Buffer.alloc(26 + 4 * 0);

      buf.writeUInt32LE(block.fg! | (block.bg! << 16));
      buf.writeUint16LE(lockPos, 4);
      buf.writeUint16LE(Flags.FLAGS_TILEEXTRA, 6);

      buf.writeUInt16LE(ExtraTypes.LOCK | (0x0 << 8), 8);
      buf.writeUInt32LE(owner, 10);
      buf.writeUInt32LE(0, 14); // admin count
      buf.writeInt32LE(-1, 18);

      return buf;
    }

    case ActionTypes.SEED: {
      buf = Buffer.alloc(14);

      buf.writeUInt32LE(block.fg! | (block.bg! << 16));
      buf.writeUint16LE(lockPos, 4);
      buf.writeUint16LE(0x0, 6);
      buf.writeUint8(ExtraTypes.SEED, 8);

      buf.writeUInt32LE(Math.floor((Date.now() - block.tree?.plantedAt!) / 1000), 9);
      buf.writeUInt8(block.tree?.fruitCount! > 4 ? 4 : block.tree?.fruitCount!, 13);

      return buf;
    }
    case ActionTypes.XENONITE: {
      buf = Buffer.alloc(13);

      buf.writeUInt32LE(block.fg! | (block.bg! << 16));
      buf.writeUint16LE(0x0, 4);
      buf.writeUint16LE(0x0, 6);

      buf.writeUint8(ExtraTypes.DISPLAY_BLOCK, 8);
      buf.writeUint32LE(block.dblockID!, 9);

      return buf;
    }
    case ActionTypes.ITEM_SUCKER: {
      buf = Buffer.alloc(13);

      buf.writeUInt32LE(block.fg! | (block.bg! << 16));
      buf.writeUint16LE(0x0, 4);
      buf.writeUint16LE(0x0, 6);

      buf.writeUint8(ExtraTypes.MAGPLANT, 8);
      buf.writeUint32LE(block.dblockID!, 9);

      return buf;
    }

    case ActionTypes.VENDING_MACHINE: {
      const fg = block.fg ?? 0;
      const bg = block.bg ?? 0;
      const dblockID = block.dblockID ?? 0;
    
      // Validate that fg, bg, and dblockID have valid values
      if (typeof fg !== 'number' || typeof bg !== 'number' || typeof dblockID !== 'number') {
        // Handle the error condition, such as throwing an error or returning a default value
        throw new Error('Invalid values for fg, bg, or dblockID');
      }
    
      const buf = Buffer.alloc(13);
    
      buf.writeUInt32LE(fg | (bg << 16));
      buf.writeUInt16LE(0x0, 4);
      buf.writeUInt16LE(0x0, 6);
    
      buf.writeUInt8(ExtraTypes.VENDING_MACHINE, 8);
      buf.writeUInt32LE(dblockID, 9);
    
      console.log("buf:", buf);
    }

    case ActionTypes.LOCK: {
      const parentBlockIndex = 123
      buf = Buffer.alloc(12);

      buf.writeUInt32LE(block.fg! | (block.bg! << 16));
      buf.writeUint16LE(lockPos, 4);
      buf.writeUint16LE(Flags.FLAGS_TILEEXTRA, 6);

      buf.writeUint8(ExtraTypes.AREA_LOCK, 8);
      buf.writeUint8(Lock ? 0x1 : 0x0, 9); // Set lock state

      if (parentBlockIndex !== undefined) {
        buf.writeUInt16LE(parentBlockIndex, 10); // Write parent block index
      } else {
        buf.writeUInt16LE(10, 10); // Write 0 if parent block index is not provided
      }

      return buf;
    }
    default: {
      buf = Buffer.alloc(8);

      buf.writeUInt32LE(block.fg! | (block.bg! << 16));
      buf.writeUint16LE(lockPos, 4);
      buf.writeUint16LE(Flags.FLAGS_PUBLIC, 6);

      return buf;
    }
  }
}
