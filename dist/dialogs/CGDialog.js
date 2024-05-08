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
            dialogName: "CGDialog"
        };
    }
    handle(base, peer, db, action) {
        // const world = peer.hasWorld(peer.data.world);
        //const pos = t.data.xPunch! + tank.data.yPunch! * world?.data.width!;
        //const block = world?.data.blocks![pos]!;
        if (action.buttonClicked === "create") {
            if (!action.guild_name || !action.guild_statement)
                return peer.send(growtopia_js_1.Variant.from("OnTalkBubble", peer.data.netID, "`4Guild Creation Failed`0: Please fill all the fields."));
            const world = peer.hasWorld(peer.data.world);
            if (world?.data.owner?.id !== peer.data.id_user)
                return peer.send(growtopia_js_1.Variant.from("OnTalkBubble", peer.data.netID, "You need to be in a empty world to create a guild!"));
            //peer.send(Variant.from({ netID: peer.data.netID }, "OnGuildDataChanged", 50478, 79289404, 100));
            //peer.send(Variant.from({ netID: peer.data.netID }, "OnNameChanged", peer.data.tankIDName + " of Legend" + "``"));
            peer.send(growtopia_js_1.Variant.from("OnTalkBubble", peer.data.netID, "Guild created!"));
            world.place({
                peer: peer,
                x: peer.data.x,
                y: peer.data.y,
                id: 5814,
                fruit: 1,
            });
            //tileUpdate(base, peer, ActionTypes.LOCK, block, world)
            //peer.send(Variant.from({ netID: peer.data.netID }, "OnCountryState",  "|showGuild"));
            //peer.send(Variant.from({ netID: peer.data.netID }, "OnParticleEffect", 48, peer.data.x! + 10, peer.data.y! + 16))
            //peer.send(Variant.from({ netID: peer.data.netID }, "OnInvis",  1))
            // db.guildCreate(action.guild_name, peer.data.tankIDName, 1, true)
            data.set(`guild_${peer.data.tankIDName}`, action.guild_name); // guild name , 
            data.set(`guildDescription_${action.guild_name}`, action.guild_statement); // description
            data.set(`guildLeader_${action.guild_name}`, peer.data.tankIDName); //guild leader 
            data.set(`guildMembers_${action.guild_name}`, []); ////guild members, 
            data.set(`guildLevel_${action.guild_name}`, 1); //guild level, 
            data.set(`guildMascot_${action.guild_name}`, 0); //guild mascot, 
            data.set(`guildWorld_${action.guild_name}`, peer.data.world); //guild world
            peer.saveToCache();
            peer.saveToDatabase();
        }
    }
}
exports.default = default_1;
