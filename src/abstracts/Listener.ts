import { ListenerEventTypes } from "../types/events";
import { BaseServer } from "../structures/BaseServer";
import { Database } from "../database/db";

export abstract class Listener<K extends keyof ListenerEventTypes> {
  public name: keyof ListenerEventTypes | undefined;
  constructor() {
    this.name = undefined;
  }

  public run(base: BaseServer, ...args: ListenerEventTypes[K]): void {}
}
