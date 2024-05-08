import { TankPacket, Variant } from "growtopia.js";
import { BaseServer } from "../structures/BaseServer";
import { Peer } from "../structures/Peer";
import { HandleTile } from "../structures/TileExtra";
import { World } from "../structures/World";
import { Block } from "../types/world";
import { TankTypes } from "../utils/enums/TankTypes";
import { ActionTypes } from "../utils/enums/Tiles";

interface Arg {
  actionType: number;
  peer: Peer;
  world: World;
  block: Block;
  id: number;
  isBg?: boolean;
  base: BaseServer;
}

export function handleBlockPlacing(p: Arg): boolean {
  switch (p.actionType) {
    case ActionTypes.SHEET_MUSIC:
    case ActionTypes.BEDROCK:
    case ActionTypes.LAVA:
    case ActionTypes.DEADLY_BLOCK:
    case ActionTypes.XENONITE:
    case ActionTypes.WEATHER_SPECIAL:
    case ActionTypes.CHECKPOINT:
    case ActionTypes.BOOMBOX:
    case ActionTypes.FOREGROUND:
    case ActionTypes.DICE:
    case ActionTypes.ICE:
    case ActionTypes.VENDING_MACHINE:
    case ActionTypes.PLATFORM:
    case ActionTypes.AUTO_ACTION_HARVEST:
    case ActionTypes.PROVIDER:
    case ActionTypes.AUTO_ACTION_HARVEST_SUCK:
    case ActionTypes.ITEM_SUCKER:
    case ActionTypes.FOSSIL:
    case ActionTypes.SFX_WITH_EXTRA_FRAME:
    case ActionTypes.BACKGROUND: {
      p.world.place({
        peer: p.peer,
        x: p.block.x!,
        y: p.block.y!,
        isBg: p.isBg,
        id: p.id
      });

      tileUpdate(p.base, p.peer, ActionTypes.FOREGROUND, p.block, p.world) // Fix re-enter
      return true;
      break;
    }
  

    case ActionTypes.PORTAL:
    case ActionTypes.DOOR:
    case ActionTypes.MAIN_DOOR: {
      p.block.door = { label: "", destination: "", id: "", locked: false };

      p.world.place({
        peer: p.peer,
        x: p.block.x!,
        y: p.block.y!,
        isBg: p.isBg,
        id: p.id
      });

      
      return true;
      break;
    }

    case ActionTypes.SIGN: {
      p.block.sign = { label: "" };

      p.world.place({
        peer: p.peer,
        x: p.block.x!,
        y: p.block.y!,
        isBg: p.isBg,
        id: p.id
      });

      return true;
      break;
    }

    case ActionTypes.HEART_MONITOR: {
      p.block.heartMonitor = {
        name: p.peer.data.tankIDName,
        user_id: parseInt(p.peer.data.id_user as string)
      };

      p.world.place({
        peer: p.peer,
        x: p.block.x!,
        y: p.block.y!,
        isBg: p.isBg,
        id: p.id
      });

      tileUpdate(p.base, p.peer, p.actionType, p.block, p.world);

      return true;
      break;
    }

    case ActionTypes.LOCK: {
      if (p.id !== 242 && p.id !== 202 && p.id !== 5814) return false;

      
      if(p.block.worldLock === true){ 
     p.peer.send(Variant.from("OnTalkBubble", p.peer.data.netID, "You can only place 1 World Lock in a world!"));
     return true
      }else {

     const locked =  p.block.worldLock = true;
      if (!p.block.lock) {
        p.block.lock = {
          ownerUserID: p.peer.data.id_user as number
        };
      }


      p.world.data.owner = {
        id: p.peer.data.id_user as number,
        name: p.peer.data.tankIDName,
        displayName: p.peer.name
      };

      p.world.place({
        peer: p.peer,
        x: p.block.x!,
        y: p.block.y!,
        isBg: p.isBg,
        id: p.id
      });


      tileUpdate(p.base, p.peer, p.actionType, p.block, p.world);

      return true;
      break;
    }
  }

    case ActionTypes.DISPLAY_BLOCK: {
      p.block.dblockID = 0;

      p.world.place({
        peer: p.peer,
        x: p.block.x!,
        y: p.block.y!,
        isBg: p.isBg,
        id: p.id
      });

      tileUpdate(p.base, p.peer, p.actionType, p.block, p.world);

      return true;
      break;
    }

    case ActionTypes.SEED: {
      if (p.block.fg !== 0) return false;

      const item = p.base.items.metadata.items[p.id];
      const fruitCount = Math.floor(Math.random() * 10 * (1 - item.rarity! / 1000)) + 1;
      const now = Date.now();

      p.block.tree = {
        fruit: p.id - 1,
        fruitCount: fruitCount,
        fullyGrownAt: now + item.growTime! * 1000,
        plantedAt: now
      };

      p.world.place({
        peer: p.peer,
        x: p.block.x!,
        y: p.block.y!,
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

export function tileUpdate(
  base: BaseServer,
  peer: Peer,
  actionType: number,
  block: Block,
  world: World
): void {
  peer.everyPeer((p) => {
    if (p.data.world === peer.data.world && p.data.world !== "EXIT") {
      p.send(
        TankPacket.from({
          type: TankTypes.TILE_UPDATE,
          xPunch: block.x,
          yPunch: block.y,
          data: () => HandleTile(base, block, world, actionType)
        })
      );
    }
  });
}
