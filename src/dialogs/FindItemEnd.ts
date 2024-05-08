import { Variant } from "growtopia.js";
import { Dialog } from "../abstracts/Dialog";
import { BaseServer } from "../structures/BaseServer";
import { Peer } from "../structures/Peer";
import { DialogReturnType } from "../types/dialog";
import { DialogBuilder } from "../utils/builders/DialogBuilder";
import { Database } from "../database/db";

export default class extends Dialog {
  constructor() {
    super();
    this.config = {
      dialogName: "find_item_end"
    };
  }

  public handle(
    base: BaseServer,
    peer: Peer,
    db: Database,
    action: DialogReturnType<{
      action: string;
      dialog_name: string;
      find_item_name: string;
      buttonClicked: string;
    }>
  ): void {
    const itemID = parseInt(action.buttonClicked);
    peer.data.inventory?.items.push({ id: itemID, amount: 200 });
    peer.send(
      Variant.from(
        "OnConsoleMessage",
        `Added \`6${
          base.items.metadata.items.find((v) => v.id === itemID)?.name
        }\`\` to your inventory.`
      )
    );
    peer.inventory();
    peer.saveToCache();
    // peer.saveToDatabase();
  }
}
