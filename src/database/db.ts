import knex from "knex";
import { User } from "../types/database";
import { PeerDataType } from "../types/peer";
import { WorldData, WorldDB } from "../types/world";
import { encrypt } from "../utils/Utils";

export class Database {

  public knex;

  constructor() {
    this.knex = knex({
      client: "better-sqlite3",
      connection: {
        filename: "./data/dev.db"
      },
      log: {
        error(m) {
          console.log(m);
        }
      },
      useNullAsDefault: true
    });
  }

  
  public async getUser(username: string) {
    let res = await this.knex.select("*").from<User>("users").where({ name: username });

    if (res.length) return res[0];
    else return undefined;
  }

  public async userSetDecay(username: string, date: string) {
    let res = await this.knex.select("*").from<User>("users").where({ name: username }).insert({ date: date });

    if (res.length) return res[0];
    else return undefined;
  }

  public async updateRole(peer: string, role: string) {
    let res = await this.knex.select("*").from<User>("users").where({ name: peer }).update({ role: role }) as string;

    if (res.length) return res[0];
    else return undefined;
  }

  public async saveUser(data: PeerDataType) {
    if (!data.id_user) return;

    let res = await this.knex("users")
      .where({ id_user: data.id_user })
      .update(
        {
          inventory: Buffer.from(JSON.stringify(data.inventory)),
          clothing: Buffer.from(JSON.stringify(data.clothing)),
          gems: data.gems
        },
        []
      );

    if (res.length) return true;
    else return undefined;
  }

  public async guildCreate(guildName: string, guildLeader: string, guildLevel: number, guildMembers: boolean) {
    let res = await this.knex("guilds").insert({ name: guildName, leader: guildLeader, level: guildLevel, members: guildMembers });

    if (res.length) return res[0];
    else return undefined;
    
  }

  public async guildUpdate(guildName: string, guildLeader: string, guildLevel: number, guildMembers: string[]) {
    let res = await this.knex("guilds").where({ name: guildName }).update({ leader: guildLeader, level: guildLevel, members: guildMembers });
    
    
  }

  public async guildDelete(guildName: string) {
    
  }

  public async getGuild(guildMembers: boolean, guildLeader: string) {
    let res = await this.knex.select("*").from("guilds").where({ members: guildMembers, leader: guildLeader });

    if (res.length) return res[0];
    else return undefined;
  }

  public async createUser(username: string, password: string) {
    const encPass = encrypt(password);

    let res = await this.knex("users").insert({ name: username, password: encPass, role: "2" });

    if (res.length) return res[0];
    else return undefined;
  }

  public async getWorld(name: string) {
    let res = await this.knex.select("*").from<WorldData>("worlds").where({ name });

    if (res.length) {
      // Parse buffer to json
      res[0].dropped = res[0].dropped
        ? JSON.parse(res[0].dropped.toString())
        : { uid: 0, items: [] };

      return res[0];
    } else return undefined;
  }

  public async saveWorld({
    name,
    ownedBy = null,
    blockCount,
    blocks,
    width,
    height,
    owner,
    dropped,
  }: WorldDB) {
    if (!name && !blockCount && !blocks && !width && !height) return;

    let res = await this.knex("worlds").insert({
      name: name,
      ownedBy: ownedBy ? ownedBy : null,
      blockCount,
      width,
      height,
      blocks,
      owner,
      dropped
    });

    if (res.length) return true;
    else return undefined;
  }

  public async updateWorld({
    name,
    ownedBy = null,
    blockCount,
    blocks,
    width,
    height,
    owner,
    dropped
  }: WorldDB) {
    if (!name && !blockCount && !blocks && !width && !height) return;

    let res = await this.knex("worlds")
      .where({ name })
      .update(
        {
          ownedBy: ownedBy ? ownedBy : null,
          blockCount,
          width,
          height,
          blocks,
          owner,
          dropped,
        },
        []
      );

    if (res.length) return res[0];
    else return undefined;
  }

  

}
