// BIKIN WORLD & HUBUNING USERS SAMA WORLDNYA KE DATABASE

import { TankPacket, TextPacket, Variant } from "growtopia.js";
import { PeerDataType } from "../types/peer";
import { ActionTypes, Flags } from "../utils/enums/Tiles";
import { Block, EnterArg, Place, WorldData } from "../types/world";
import { BaseServer } from "./BaseServer";
import { WORLD_SIZE, Y_END_DIRT, Y_LAVA_START, Y_START_DIRT } from "../utils/Constants";
import { TankTypes } from "../utils/enums/TankTypes";
import { HandleTile } from "./TileExtra";
import { Peer } from "./Peer";
import { DataTypes } from "../utils/enums/DataTypes";
import { QuickDB } from "quick.db";
import { tileUpdate } from "../tanks/BlockPlacing";
import { buffer } from "stream/consumers";
const data = new QuickDB

export class World {
  [x: string]: any;
  handlePunch(arg0: { data: { xPunch: number; yPunch: number; }; }, peer: Peer, base: BaseServer, world: World) {
    throw new Error("Method not implemented.");
  }
  public data: WorldData = {};
  public worldName;

  constructor(private base: BaseServer, worldName: string) {
    this.base = base;
    this.worldName = worldName;
  }

  public saveToCache() {
    this.base.cache.worlds.setWorld(this.worldName, this.data);
    return;
  }

  public getWorldCache(worldName: string) {
    return this.base.cache.worlds.getWorld(worldName);
  }

  public async saveToDatabase() {
    const wrld = this.getWorldCache(this.worldName)!;
    const world = await this.base.database.getWorld(this.worldName);
    if (world) {
      await this.base.database.updateWorld({
        name: wrld.worldName,
        ownedBy: wrld.data.owner ? `${wrld.data.owner.id}` : null,
        blockCount: wrld.data.blockCount!,
        width: wrld.data.width!,
        height: wrld.data.height!,
        blocks: Buffer.from(JSON.stringify(wrld.data.blocks)),
        owner: wrld.data.owner ? Buffer.from(JSON.stringify(wrld.data.owner)) : null,
        dropped: Buffer.from(JSON.stringify(wrld.data.dropped)),
        //admins: []
      });
    } else {
      await this.base.database.saveWorld({
        name: wrld?.data.name!,
        ownedBy: wrld?.data.owner ? `${wrld.data.owner.id}` : null,
        blockCount: wrld?.data.blockCount!,
        width: wrld?.data.width!,
        height: wrld?.data.height!,
        blocks: Buffer.from(JSON.stringify(wrld?.data.blocks!)),
        owner: wrld.data.owner ? Buffer.from(JSON.stringify(wrld?.data.owner!)) : null,
        dropped: Buffer.from(JSON.stringify(wrld.data.dropped)),
      //  admins: []
      });
    }
  }

  public place({ peer, x, y, isBg, id, fruit }: Place) {
    let state = 0x8;

    const block = this.data.blocks![x + y * this.data.width!];
    block[isBg ? "bg" : "fg"] = id;

    if (peer.data.rotatedLeft) {
      state |= 0x10;
      block.rotatedLeft = true;
    }

    peer.everyPeer((p) => {
      if (p.data.world === this.data.name && p.data.world !== "EXIT") {
        const packet = TankPacket.from({
          type: TankTypes.PEER_DROP,
          netID: peer.data.netID,
          state,
          info: id,
          xPunch: x,
          yPunch: y
        });

        const buffer = packet.parse();

        buffer[7] = fruit || 0;
        p.send(buffer);
      }
    });
  }

  public leave(peer: Peer, sendMenu = true) {
    this.data.playerCount!--;

    peer.send(
      TextPacket.from(DataTypes.ACTION, "action|play_sfx", `file|audio/door_shut.wav`, `delayMS|0`)
    );
    peer.everyPeer((p) => {
      if (
        p.data.netID !== peer.data.netID &&
        p.data.world !== "EXIT" &&
        p.data.world === peer.data.world
      )
        p.send(
          Variant.from("OnRemove", `netID|${peer.data.netID}`),
          Variant.from(
            "OnConsoleMessage",
            `\`5<${peer.name}\`\` left, \`w${this.data.playerCount}\`\` others here\`5>\`\``
          ),
          Variant.from(
            "OnTalkBubble",
            peer.data.netID,
            `\`5<${peer.name}\`\` left, \`w${this.data.playerCount}\`\` others here\`5>\`\``
          ),
          TextPacket.from(
            DataTypes.ACTION,
            "action|play_sfx",
            `file|audio/door_shut.wav`,
            `delayMS|0`
          )
        );
    });

    if (sendMenu)
      peer.send(
        Variant.from({ delay: 500 }, "OnRequestWorldSelectMenu", "add_filter|\nadd_heading|Top Worlds|\nadd_floater|wotd_world|START|0|0.5|2147418367|"),
        Variant.from({ delay: 500 }, "OnConsoleMessage", `Where do you want to go?`)

      );

    peer.data.world = "EXIT";
    this.saveToCache();
    peer.saveToCache();
    // this.saveToDatabase();
    // peer.saveToDatabase();
    if (this.data.playerCount! < 1) {
      // TODO: delete the cache (if needed) & save it to db
    }
  }

  

  public async getData() {
    if (!this.base.cache.worlds.has(this.worldName)) {
      const world = await this.base.database.getWorld(this.worldName);
      if (world) {
        this.data = {
          name: world.name,
          width: world.width,
          height: world.height,
          blockCount: world.blockCount,
          blocks: JSON.parse(world.blocks?.toString()!),
          admins: [],
          playerCount: 0,
          jammers: [],
          dropped: world.dropped,
          owner: world.owner ? JSON.parse(world.owner?.toString()!) : null
        };
      } else {
        this.generate(true);
      }
    } else this.data = this.base.cache.worlds.get(this.worldName)!;
  }

  public async enter(peer: Peer, { x, y }: EnterArg) {
    // this.data = peer.hasWorld(this.worldName).data;
    // console.log(this.base.cache.worlds.get(worldName));
    await this.getData();

    if (typeof x !== "number") x = -1;
    if (typeof y !== "number") y = -1;

    const tank = TankPacket.from({
      type: TankTypes.PEER_WORLD,
      state: 8,
      data: () => {
        const HEADER_LENGTH = this.worldName.length + 20;
        const buffer = Buffer.alloc(HEADER_LENGTH);

        // World data
        buffer.writeUint16LE(0x14);
        buffer.writeUint32LE(0x40, 2);
        buffer.writeUint16LE(this.worldName.length, 6);
        buffer.write(this.worldName, 8);
        buffer.writeUint32LE(this.data.width!, 8 + this.worldName.length);
        buffer.writeUint32LE(this.data.height!, 12 + this.worldName.length);
        buffer.writeUint32LE(this.data.blockCount!, 16 + this.worldName.length);

        // Tambahan 5 bytes, gatau ini apaan
        const unk1 = Buffer.alloc(5);

        // Block data
        const blockBytes: any[] = [];
        this.data.blocks?.forEach((block) => {
          let item = this.base.items.metadata.items.find((i) => i.id === block.fg);

          let blockBuf = HandleTile(this.base, block, this, item?.type);

          blockBuf.forEach((b) => blockBytes.push(b));
        });

        // Tambahan 12 bytes, gatau ini apaan
        const unk2 = Buffer.alloc(12);

        // Drop data
        const dropData = Buffer.alloc(8 + this.data.dropped?.items.length! * 16);
        dropData.writeUInt32LE(this.data.dropped?.items.length!);
        dropData.writeUInt32LE(this.data.dropped?.uid!, 4);

        let pos = 8;
        this.data.dropped?.items.forEach((item) => {
          dropData.writeUInt16LE(item.id, pos);
          dropData.writeFloatLE(item.x, pos + 2);
          dropData.writeFloatLE(item.y, pos + 6);
          dropData.writeUInt8(item.amount < -1 ? 0 : item.amount, pos + 10);
          // ignore flags / 0x0
          dropData.writeUInt32LE(item.uid, pos + 12);

          pos += 16;
        });

        // Weather
        const weatherData = Buffer.alloc(12);
        weatherData.writeUint16LE(0); // weather id
        weatherData.writeUint16LE(0x1, 2); // on atau off (mungkin)
        weatherData.writeUint32LE(0x0, 4); // ??
        weatherData.writeUint32LE(0x0, 8); // ??

        return Buffer.concat([
          buffer,
          Buffer.concat([unk1, Buffer.from(blockBytes)]),
          Buffer.concat([unk2, dropData, weatherData])
        ]);
      }
    });

    const mainDoor = this.data.blocks!.find((block) => block.fg === 6);

    const xPos = (x < 0 ? mainDoor?.x || 0 : x) * 32,
      yPos = (y < 0 ? mainDoor?.y || 0 : y) * 32;

    peer.send(tank);
    peer.data.x = xPos;
    peer.data.y = yPos;
    peer.data.world = this.worldName;

    peer.send(
      Variant.from(
        { delay: -1 },
        "OnSpawn",
        "spawn|avatar\n" +
          `netID|${peer.data.netID}\n` +
          `userID|${peer.data.id_user}\n` + // taro di peer nanti
          `colrect|0|0|20|30\n` +
          `posXY|${peer.data.x}|${peer.data.y}\n` +
          `name|\`w${peer.name}\`\`\n` +
          `country|${peer.data.country}\n` + // country peer
          "invis|0\n" +
          "mstate|0\n" +
          "smstate|0\n" +
          "onlineID|\n" +
          "type|local"
      ),

      Variant.from(
        {
          netID: peer.data.netID
        },
        "OnSetClothing",
        [peer.data.clothing?.hair!, peer.data.clothing?.shirt!, peer.data.clothing?.pants!],
        [peer.data.clothing?.feet!, peer.data.clothing?.face!, peer.data.clothing?.hand!],
        [peer.data.clothing?.back!, peer.data.clothing?.mask!, peer.data.clothing?.necklace!],
        0x8295c3ff,
        [peer.data.clothing?.ances!, 0.0, 0.0]
      )
    );

    if (this.data.owner) {
      peer.send(
        Variant.from(
          "OnConsoleMessage",
          `\`#[\`0\`9World Locked by ${this.data.owner.displayName}\`#]`
        )
      );
    }

    if(this.worldName === "GROWGANOTH"){
      peer.everyPeer((p)=> {
        peer.send(Variant.from("OnSetCurrentWeather", 9))
        p.send(Variant.from("OnTalkBubble", peer.data.netID, "`2Growganoth is active!`0, Try to drop items and get rare items."))

        

      })
     // peer.send(Variant.from("OnSetCurrentWeather", 9)) // 6 harvest
    }

    const haveXeno = await data.get(`haveXeno_${peer.data.world}`)
    const onEvent = await data.get(`onEvent_${peer.data.world}`)
    const carnival = await data.get(`Carnival`)
    
    if(haveXeno){
      peer.send(Variant.from( "OnTalkBubble",
        peer.data.netID, "Xenonite has changed everyone's powers! `2Strong Punch granted`0!"))
        peer.send(Variant.from( "OnConsoleMessage",
        "Xenonite has changed everyone's powers! `2Strong Punch granted`0!"))
    }

    function getRandomInt(min: number, max: number): number {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    }
    
    // Example: Generate a random number between 1 and 10 (inclusive)
    const randomNum = getRandomInt(500, 1000);

    // 100, 60
   if(onEvent){
      setTimeout(() => {
        peer.everyPeer((p) => {
          if(p.data.world === p.data.world){
          p.send(Variant.from("OnAddNotification", 50, "`9World Lock `0spawns! `4You have 10 seconds to find it."))
          data.set(`onEvent_${peer.data.world}`, false)  
          }
          this.drop(peer, randomNum, randomNum, 242, 1)
          console.log(`[Event] World me)Lock [Dropped] in ${peer.data.world} | x: ${randomNum} y; ${randomNum}`)
        })
      }, 100)

      // Schedule a task to execute after 10 seconds
const delayInMilliseconds = 10 * 1000; // 10 seconds in milliseconds

setTimeout(() => {
  peer.everyPeer((p) => {
    p.send(Variant.from("OnAddNotification", 50, "`4Event ended. `9Congratulations for those who found it!"))
  })
}, delayInMilliseconds);

      /*peer.everyPeer((p) => {
        this.drop(p, 20, 20, 242, 1)
        //console.log(`[Event] World Lock [Dropped] in ${p.data.world} | x: ${randomNum} y; ${randomNum}`)
       // p.send(Variant.from("OnAddNotification", 50, "`9World Locks `0spawns! `4You have 10 minutes to find it."))
         data.set(`onEvent_${p.data.world}`, false)   */                
    //  })*/
    }

    

    

    peer.everyPeer((p) => {
      if (
        p.data.netID !== peer.data.netID &&
        p.data.world === peer.data.world &&
        p.data.world !== "EXIT"
      ) {
        p.send(
          Variant.from(
            { delay: -1 },
            "OnSpawn",
            "spawn|avatar\n" +
              `netID|${peer.data.netID}\n` +
              `userID|${peer.data.id_user}\n` +
              `colrect|0|0|20|30\n` +
              `posXY|${peer.data.x}|${peer.data.y}\n` +
              `name|\`w${peer.name}\`\`\n` +
              `country|${peer.data.country}\n` +
              "invis|0\n" +
              "mstate|0\n" +
              "smstate|0\n" +
              "onlineID|\n"
          ),
          Variant.from(
            {
              netID: peer.data.netID
            },
            "OnSetClothing",
            [peer.data.clothing?.hair!, peer.data.clothing?.shirt!, peer.data.clothing?.pants!],
            [peer.data.clothing?.feet!, peer.data.clothing?.face!, peer.data.clothing?.hand!],
            [peer.data.clothing?.back!, peer.data.clothing?.mask!, peer.data.clothing?.necklace!],
            0x8295c3ff,
            [peer.data.clothing?.ances!, 0.0, 0.0]
          ),
          Variant.from(
            "OnConsoleMessage",
            `\`5<${peer.name}\`\` joined, \`w${this.data.playerCount}\`\` others here\`5>\`\``
          ),
          Variant.from(
            "OnTalkBubble",
            peer.data.netID,
            `\`5<${peer.name}\`\` joined, \`w${this.data.playerCount}\`\` others here\`5>\`\``
          ),
          TextPacket.from(
            DataTypes.ACTION,
            "action|play_sfx",
            `file|audio/door_open.wav`,
            `delayMS|0`
          )
        );

        peer.send(
          Variant.from(
            { delay: -1 },
            "OnSpawn",
            "spawn|avatar\n" +
              `netID|${p.data.netID}\n` +
              `userID|${p.data.id_user}\n` +
              `colrect|0|0|20|30\n` +
              `posXY|${p.data.x}|${p.data.y}\n` +
              `name|\`w${p.name}\`\`\n` +
              `country|${p.data.country}\n` +
              "invis|0\n" +
              "mstate|0\n" +
              "smstate|0\n" +
              "onlineID|\n"
          ),
          Variant.from(
            {
              netID: p.data.netID
            },
            "OnSetClothing",
            [p.data.clothing?.hair!, p.data.clothing?.shirt!, p.data.clothing?.pants!],
            [p.data.clothing?.feet!, p.data.clothing?.face!, p.data.clothing?.hand!],
            [p.data.clothing?.back!, p.data.clothing?.mask!, p.data.clothing?.necklace!],
            0x8295c3ff,
            [p.data.clothing?.ances!, 0.0, 0.0]
          )
        );
      }
    });
    this.data.playerCount!++;

    this.saveToCache();
    peer.saveToCache();
  }

  public generate(cache?: boolean) {
    if (!this.worldName) throw new Error("World name required.");
    const width = WORLD_SIZE.WIDTH;
    const height = WORLD_SIZE.HEIGHT;
    const blockCount = height * width;

    const data: WorldData = {
      name: this.worldName,
      width,
      height,
      blockCount,
      blocks: [],
      admins: [], // separate to different table
      playerCount: 0,
      jammers: [], // separate to different table
      dropped: {
        // separate (maybe?) to different table
        uid: 0,
        items: []
      }
    };

    // starting points
    let x = 0;
    let y = 0;
    // main door location
    const mainDoorPosition = Math.floor(Math.random() * width);

    for (let i = 0; i < blockCount; i++) {
      // increase y axis, reset back to 0
      if (x >= width) {
        y++;
        x = 0;
      }

      const block: Block = { x, y };
      block.fg = 0;
      block.bg = 0;

      if (block.y === Y_START_DIRT - 1 && block.x === mainDoorPosition) {
        block.fg = 6;
        block.door = {
          label: "EXIT",
          destination: "EXIT"
        };
      } else if (block.y! >= Y_START_DIRT) {
        block.fg =
          block.x === mainDoorPosition && block.y === Y_START_DIRT
            ? 8
            : block.y! < Y_END_DIRT
            ? block.y! >= Y_LAVA_START
              ? Math.random() > 0.2
                ? Math.random() > 0.1
                  ? 2
                  : 10
                : 4
              : Math.random() > 0.01
              ? 2
              : 10
            : 8;
        block.bg = 14;
      }

      data.blocks!.push(block);

      x++;
    }
    this.data = data;
    if (cache) this.saveToCache();
  }

  public clearWorld(cache?: boolean) {
    if (!this.worldName) throw new Error("World name required.");
    const width = WORLD_SIZE.WIDTH;
    const height = WORLD_SIZE.HEIGHT;
    const blockCount = 0;

    const data: WorldData = {
      name: this.worldName,
      width,
      height,
      blockCount,
      blocks: [],
      admins: [], // separate to different table
      playerCount: 0,
      jammers: [], // separate to different table
      dropped: {
        // separate (maybe?) to different table
        uid: 0,
        items: []
      }
    };

    // starting points
    let x = 0;
    let y = 0;
    // main door location
    const mainDoorPosition = Math.floor(Math.random() * width);

    for (let i = 0; i < blockCount; i++) {
      // increase y axis, reset back to 0
      if (x >= width) {
        y++;
        x = 0;
      }

      const block: Block = { x, y };
      block.fg = 0;
      block.bg = 0;

      if (block.y === Y_START_DIRT - 1 && block.x === mainDoorPosition) {
        block.fg = 6;
        block.door = {
          label: "EXIT",
          destination: "EXIT"
        };
      } else if (block.y! >= Y_START_DIRT) {
        block.fg =
          block.x === mainDoorPosition && block.y === Y_START_DIRT
            ? 8
            : block.y! < Y_END_DIRT
            ? block.y! >= Y_LAVA_START
              ? Math.random() > 0.2
                ? Math.random() > 0.1
                  ? 2
                  : 10
                : 4
              : Math.random() > 0.01
              ? 2
              : 10
            : 8;
        block.bg = 14;
      }

      data.blocks!.push(block);

      x++;
    }
    this.data = data;
    if (cache) this.saveToCache();
  }


  public drop(
    peer: Peer,
    x: number,
    y: number,
    id: number,
    amount: number,
    { tree, noSimilar }: any = {}
  ) {
    const tank = TankPacket.from({
      type: TankTypes.PEER_DROP,
      netID: -1,
      targetNetID: tree ? -1 : peer.data.netID,
      state: 0,
      info: id,
      xPos: x,
      yPos: y
    });

    const position = Math.trunc(x / 32) + Math.trunc(y / 32) * this.data.width!;
    const block = this.data.blocks![position];

    const similarDrops = noSimilar
      ? null
      : this.data.dropped?.items
          .filter((i) => i.id === id && block.x === i.block.x && block.y === i.block.y)
          .sort((a, b) => a.amount - b.amount);

    const similarDrop = Array.isArray(similarDrops) ? similarDrops[0] : null;

    if (similarDrop && similarDrop.amount < 200) {
      if (similarDrop.amount + amount > 200) {
        const extra = similarDrop.amount + amount - 200;

        amount = 0;
        similarDrop.amount = 200;

        this.drop(peer, x, y, id, extra, { tree: true });
      }

      tank.data!.netID = -3;
      tank.data!.targetNetID = similarDrop.uid;

      tank.data!.xPos = similarDrop.x;
      tank.data!.yPos = similarDrop.y;

      amount += similarDrop.amount;

      similarDrop.amount = amount;
    } else
      this.data.dropped?.items.push({
        id,
        amount,
        x,
        y,
        uid: ++this.data.dropped.uid,
        block: { x: block.x!, y: block.y! }
      });

    const buffer = tank.parse();
    buffer.writeFloatLE(amount, 20);

    peer.everyPeer(
      (p) => p.data.world === peer.data.world && p.data.world !== "EXIT" && p.send(buffer)
    );

    this.saveToCache();
  }

 public dropGems(
    peer: Peer,
    x: number,
    y: number,
    id: number,
    amount: number,
    { tree, noSimilar }: any = {}
  ) {
    const tank = TankPacket.from({
      type: TankTypes.PEER_DROP,
      netID: -1,
      targetNetID: tree ? -1 : peer.data.netID,
      state: 0,
      info: id,
      xPos: x,
      yPos: y,
    
    });
  
    const position = Math.trunc(x / 32) + Math.trunc(y / 32) * this.data.width!;
    const block = this.data.blocks![position];
  
    const similarDrops = noSimilar
      ? null
      : this.data.dropped?.items
          .filter((i) => i.id === id && block.x === i.block.x && block.y === i.block.y)
          .sort((a, b) => a.amount - b.amount);
  
    const similarDrop = Array.isArray(similarDrops) ? similarDrops[0] : null;
  
    if (similarDrop && similarDrop.amount < 200) {
      if (similarDrop.amount + amount > 200) {
        const extra = similarDrop.amount + amount - 200;
  
        amount = 0;
        similarDrop.amount = 200;
  
        this.dropGems(peer, x, y, id, extra, { tree: true });
      }
  
      tank.data!.netID = -3;
      tank.data!.targetNetID = similarDrop.uid;
  
      tank.data!.xPos = similarDrop.x;
      tank.data!.yPos = similarDrop.y;
  
      amount += similarDrop.amount;
  
      similarDrop.amount = amount;
    } else {
      const gemQuantities = [100, 50, 10, 5, 1];
  
      for (const quantity of gemQuantities) {
        while (amount >= quantity) {
          const gemAmountToDrop = quantity;
  
          if (amount >= gemAmountToDrop) {
            this.data.dropped?.items.push({
              id,
              amount: gemAmountToDrop,
              x,
              y,
              uid: ++this.data.dropped.uid,
              block: { x: block.x!, y: block.y! },
            });
  
            const buffer = tank.parse();
            buffer.writeFloatLE(gemAmountToDrop, 20);
  
            peer.everyPeer(
              (p) => p.data.world === peer.data.world && p.data.world !== "EXIT" && p.send(buffer)
            );
  
            amount -= gemAmountToDrop;
          }
        }
      }
    }
  
    this.saveToCache();
  }
 
  
  
  
  
  

  public collect(peer: Peer, uid: number) {
    const droppedItem = this.data.dropped?.items.find((i) => i.uid === uid);
    if (!droppedItem) return;
    const item = this.base.items.metadata.items.find((i) => i.id === droppedItem.id);

    const itemInInv = peer.data.inventory?.items.find((i) => i.id === droppedItem.id);

    if (
      (!itemInInv && peer.data.inventory!.items.length >= peer.data.inventory?.max!) ||
      (itemInInv && itemInInv.amount >= 200)
    )
      return;

    peer.everyPeer(
      (p) =>
        p.data.world === peer.data.world &&
        p.data.world !== "EXIT" &&
        p.send(
          TankPacket.from({
            type: TankTypes.PEER_DROP,
            netID: peer.data.netID,
            targetNetID: -1,
            info: uid
          })
        )
    );

    if (itemInInv) {
      if (droppedItem.amount + itemInInv.amount > 200) {
        console.log(droppedItem);
        const extra = droppedItem.amount + itemInInv.amount - 200;
        peer.send(
          Variant.from("OnConsoleMessage", `Collected \`w${200 - itemInInv.amount} ${item?.name}`)
        );
        itemInInv.amount = 200;

        this.drop(peer, droppedItem.x, droppedItem.y, droppedItem.id, extra, {
          noSimilar: true,
          tree: true
        });
      } else {
        if (droppedItem.id !== 112) {
          itemInInv.amount += droppedItem.amount;
          peer.send(
            Variant.from("OnConsoleMessage", `Collected \`w${droppedItem.amount} ${item?.name}`)
          );
        } else {
          peer.data.gems += droppedItem.amount;
        }
      }
    } else {
      if (droppedItem.id !== 112) {
        peer.addItemInven(droppedItem.id, droppedItem.amount);
        peer.send(
          Variant.from("OnConsoleMessage", `Collected \`w${droppedItem.amount} ${item?.name}`)
        );
      } else {
        peer.data.gems += droppedItem.amount;
      }
    }

    this.data.dropped!.items = this.data.dropped!.items.filter((i) => i.uid !== droppedItem.uid);

    peer.saveToCache();
    this.saveToCache();
  }

  public harvest(peer: Peer, block: Block) {
    if (block.tree && Date.now() >= block.tree.fullyGrownAt) {
      this.drop(
        peer,
        block.x! * 32 + Math.floor(Math.random() * 16),
        block.y! * 32 + Math.floor(Math.random() * 16),
        block.tree.fruit,
        block.tree.fruitCount,
        { tree: true }
      );

      block.tree = undefined;
      block.fg = 0x0;

      peer.everyPeer(
        (p) =>
          p.data.world === peer.data.world &&
          p.data.world !== "EXIT" &&
          p.send(
            TankPacket.from({
              type: TankTypes.TILE_TREE,
              netID: peer.data.netID,
              targetNetID: -1,
              xPunch: block.x,
              yPunch: block.y
            })
          )
      );

      return true;
    } else return false;
  }

  public add_lock_data_to_packet(block: Block, buffer: Buffer) {
    if (!block.lock) return;
    const newBuf = Buffer.alloc(buffer.length + 2);
    buffer.copy(newBuf, 0, 0, 8);

    const lockPos = block.lock.ownerX! + block.lock.ownerY! * this.data.width!;
    const flag = newBuf.readUInt16LE(6);

    newBuf.writeUInt16LE(lockPos, 4);
    newBuf.writeUInt16LE(flag | Flags.FLAGS_LOCKED, 6);
    newBuf.writeUInt16LE(lockPos, 8);

    buffer.copy(newBuf, 10, 8);
    return newBuf;
  }

  
}
