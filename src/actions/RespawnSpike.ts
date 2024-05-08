import { Action } from "../abstracts/Action";
import { Peer } from "../structures/Peer";
import { BaseServer } from "../structures/BaseServer";
import { ActionType } from "../types/action";
import { Database } from "../database/db";

export default class extends Action {
  constructor() {
    super();
    this.config = {
      eventName: "respawn_spike"
    };
  }

  public handle(base: BaseServer, peer: Peer,db: Database, action: ActionType<{ action: string }>): void {
    peer.respawn();
    // TODO: respawn back to previous checkpoint
  }
}
