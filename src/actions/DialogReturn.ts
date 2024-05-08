import { Action } from "../abstracts/Action";
import { Peer } from "../structures/Peer";
import { BaseServer } from "../structures/BaseServer";
import { ActionType } from "../types/action";
import { Database } from "../database/db";

export default class extends Action {
  constructor() {
    super();
    this.config = {
      eventName: "dialog_return"
    };
  }

  public handle(
    base: BaseServer,
    peer: Peer,
    db: Database,
    action: ActionType<{ action: string; dialog_name: string }>,
  ): void {
    let name = action.dialog_name;
    try {
      if (!base.dialogs.has(name)) return;
      base.dialogs.get(name)!.handle(base, peer,db , action);
    } catch (err) {
      console.log(err);
    }
  }
}
