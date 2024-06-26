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
const Dialog_1 = require("../abstracts/Dialog");
const fs = __importStar(require("fs"));
class default_1 extends Dialog_1.Dialog {
    constructor() {
        super();
        this.config = {
            dialogName: "drop_end"
        };
    }
    handle(base, peer, db, action) {
        if (!/\d/.test(action.drop_count) || !/\d/.test(action.itemID)) {
            return peer.send(growtopia_js_1.Variant.from("OnTalkBubble", peer.data.netID, "Uh oh, thats not a valid number"));
        }
        const itemID = parseInt(action.itemID);
        const count = parseInt(action.drop_count);
        const itemExist = peer.data.inventory?.items.find((i) => i.id === itemID);
        const world = peer.hasWorld(peer.data.world);
        if (!itemExist || itemExist.amount <= 0) {
            return peer.send(growtopia_js_1.Variant.from("OnTalkBubble", peer.data.netID, "That item, seems not exist in your inventory"));
        }
        if (itemExist.amount === count) {
            peer.sendClothes();
            peer.inventory();
            peer.saveToCache();
        }
        if (count > itemExist.amount) {
            return peer.send(growtopia_js_1.Variant.from("OnTalkBubble", peer.data.netID, "Really?"));
        }
        if (count <= 0) {
            return peer.send(growtopia_js_1.Variant.from("OnTalkBubble", peer.data.netID, "Nice try. You remind me of myself at that age."));
        }
        if (peer.data.world === "GROWGANOTH") {
            switch (itemID) {
                case 2390: {
                    const itemDropped = world?.data.dropped?.items.find((i) => i.x === 738 && i.y === 738);
                    if (!itemDropped) {
                        peer.send(growtopia_js_1.Variant.from("OnTalkBubble", peer.data.netID, "`bAmazing... here's a `4Teeny Devil Wings`b!"));
                        peer.addItemInven(3120, 1);
                        peer.removeItemInven(2390, 1);
                        peer.saveToCache();
                        const dropped = world?.data.dropped?.items.find((i) => i.uid === 253); // 698
                        if (!dropped)
                            return;
                        world?.collect(peer, dropped.uid);
                        //peer.removeItemInven(242, 1)
                        //peer.inventory();
                        //peer.saveToCache();
                        peer.everyPeer((p) => {
                            p.send(growtopia_js_1.Variant.from("OnConsoleMessage", peer.data.netID, `${peer.name} got \`2Teeny Devil Wings\`b! Such a rich person...`));
                        });
                        peer.respawn();
                        console.log(dropped);
                        //world?.collect(peer, 242); // Collect the dropped item
                        break;
                    }
                    else {
                        peer.send(growtopia_js_1.Variant.from("OnTalkBubble", peer.data.netID, "`bYou can only drop in the black hold..."));
                    }
                }
                /*case 2390: {
                  const itemDropped = world?.data.dropped?.items.find((i) => i.x === 738 && i.y === 738);
        
                  if(!itemDropped){
                  peer.send(Variant.from("OnTalkBubble", peer.data.netID, "`bAmazing... here's a `4Teeny Devil Wings`b!"));
                  peer.addItemInven(3120, 1);
                  peer.removeItemInven(2390, 1)
                  peer.inventory();
                  peer.saveToCache();
                  
        
                  const dropped = world?.data.dropped?.items.find((i) => i.uid === 251)
        
        
                  //if(!dropped) return
                    world?.collect(peer, dropped!.uid)
                    console.log(dropped)
        
                  peer.everyPeer((p) => {
                    p.send(Variant.from("OnConsoleMessage", peer.data.netID, `${peer.name} got \`2Teeny Devil Wings\`b! Such a rich person...`));
                  })
        
            
                    //console.log(dropped)
                  //world?.collect(peer, 242); // Collect the dropped item
                  break;
              }
                }*/
            }
        }
        peer.drop(itemID, count);
        peer.removeItemInven(itemID, count);
        peer.inventory();
        peer.sendClothes();
        world?.collect(peer, itemID);
        let p = peer;
        p.send(growtopia_js_1.Variant.from({
            netID: p.data.netID
        }, "OnSetClothing", [p.data.clothing?.hair, p.data.clothing?.shirt, p.data.clothing?.pants], [p.data.clothing?.feet, p.data.clothing?.face, p.data.clothing?.hand], [p.data.clothing?.back, p.data.clothing?.mask, p.data.clothing?.necklace], 0x8295c3ff, [p.data.clothing?.ances, 0.0, 0.0]));
        /*if(peer.data.world === "GROWGANOTH"){
    
          switch(itemID){
            case 242: {
    
             /// peer.drop(itemID, 0)
              peer.send(Variant.from("OnTalkBubble", peer.data.netID, "`bA world lock... here's 1 lock of fur!"));
              peer.addItemInven(1212, 1);
              peer.inventory();
              peer.saveToCache()
    
              world?.collect(peer, 242);
              break;
            }
          }
        }*/
        const timestamp = new Date().toLocaleString(); // Get the current date and time
        const folderPath = '/Users/macbook/Desktop/GrowAsia/drop-logs'; // Replace with the path to your target folder
        const fileName = `${world?.worldName}.txt`;
        const message = `[${timestamp}] ${peer.name} dropped ${count} (ItemID: ${itemID})`; // Replace with your desired message
        fs.mkdir(folderPath, { recursive: true }, (err) => {
            if (err) {
                console.error('Error creating folder:', err);
            }
            else {
                const filePath = `${folderPath}/${fileName}`;
                const writeStream = fs.createWriteStream(filePath, { flags: 'a' }); // Use 'a' flag for append mode
                writeStream.write(message + '\n');
                writeStream.end();
                writeStream.on('finish', () => {
                    console.log(`New logs: ${filePath}`);
                });
                writeStream.on('error', (err) => {
                    console.error('Error writing message:', err);
                });
            }
        });
    }
}
exports.default = default_1;
