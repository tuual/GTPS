import { TankPacket, Variant } from "growtopia.js";
import { Peer } from "../structures/Peer";
import { Action } from "../abstracts/Action";
import { BaseServer } from "../structures/BaseServer";
import { TankTypes } from "../utils/enums/TankTypes";
import { ActionType } from "../types/action";
import { Database } from "../database/db";

export default class extends Action {
  constructor() {
    super();
    this.config = {
      eventName: "refresh_item_data"
    };
  }

  public handle(base: BaseServer, peer: Peer,db: Database, action: ActionType<{ action: string }>): void {
    peer.send(
      Variant.from("OnConsoleMessage", "One moment. Updating item data..."),
      //TankPacket.from({ type: TankTypes.PEER_ITEMS_DAT, data: () => base.items.hash }),
      TankPacket.from({ type: TankTypes.PEER_ITEMS_DAT, data: () => base.items.content })
    );
  }
}
