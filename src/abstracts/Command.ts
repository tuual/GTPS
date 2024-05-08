import { Database } from "../database/db";
import { BaseServer } from "../structures/BaseServer";
import { Peer } from "../structures/Peer";
import { World } from "../structures/World";
import { CommandOptions } from "../types/command";

export abstract class Command {
  public opt: CommandOptions;

  constructor() {
    this.opt = {
      name: "",
      description: "",
      cooldown: 1,
      ratelimit: 1,
      category: "",
      usage: "",
      example: [],
      permission: []
    };
  }

  public async execute(base: BaseServer, peer: Peer, text: string, args: string[], db: Database): Promise<void> {}
}
