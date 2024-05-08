import { TextPacket, Variant } from "growtopia.js";
import { Command } from "../abstracts/Command";
import { BaseServer } from "../structures/BaseServer";
import { Peer } from "../structures/Peer";
import { CommandOptions } from "../types/command";
import { DialogBuilder } from "../utils/builders/DialogBuilder";
import { Role } from "../utils/Constants";
import { DataTypes } from "../utils/enums/DataTypes";

export default class extends Command {
  public opt: CommandOptions;

  constructor() {
    super();
    this.opt = {
      name: "find",
      description: "Find some items",
      cooldown: 5,
      ratelimit: 5,
      category: "Basic",
      usage: "/find",
      example: ["/find"],
      permission: [Role.BASIC, Role.ADMIN, Role.DEVELOPER]
    };
  }

  public async execute(base: BaseServer, peer: Peer, text: string, args: string[]): Promise<void> {
    let dialog = new DialogBuilder()
      .defaultColor()
      .addLabelWithIcon("Find the item", "6016", "big")
      if(peer.data.role === Role.DEVELOPER){ 
      dialog.addCheckbox("seed_only", "Only seed", "not_selected")
      }
      dialog.addInputBox("find_item_name", "", "", 30)
      
      
      dialog.addQuickExit()
      .endDialog("find_item", "Cancel", "Find")
      .str();

    peer.send(Variant.from("OnDialogRequest", dialog.str()));
  }
}


