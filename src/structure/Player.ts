import { User } from "discord.js";
import { client } from "../index";
import { Player as PlayerRPG } from "@jiman24/discordjs-rpg";
import { code, currency } from "../utils";
import { Item } from "./Item";

export class Player extends PlayerRPG {
  name: string;
  coins = 0;
  level = 1;
  xp = 0;
  win = 0;
  hunt = 0;
  currentMonster = 0;
  inventory: Item[] = [];
  equippedItems: Item[] = [];

  constructor(user: User, imageUrl: string) {
    super(user);
    this.name = user.username;
    this.imageUrl = imageUrl;
  }

  static fromUser(user: User) {

    const data = client.players.get(user.id);

    if (!data) {
      throw new PlayerNotFoundErr("character has not been created");
    }

    const player = new Player(user, data.imageUrl);
    Object.assign(player, data);

    const offset = player.level - 1;
    player.hp += offset * 10
    player.attack += offset * 2
    player.critDamage += offset * 0.01;


    player.inventory = player.inventory
      .filter(x => !!x)
      .map(inv => Item.get(inv.id)!);

    player.equippedItems = player.equippedItems
      .filter(x => !!x)
      .map(item => Item.get(item.id)!);

    for (const item of player.equippedItems) {
      item.apply(player);
    }

    return player;
  }

  /** required xp to upgrade to the next level */
  private requiredXP() {
    let x = 10;
    let lvl = this.level
    while (lvl > 1) {
      x += Math.round(x * 0.4);
      lvl--;
    }
    return x;
  }


  /** adds xp and upgrades level accordingly */
  addXP(amount: number) {
    this.xp += amount;
    const requiredXP = this.requiredXP();

    if (this.xp >= requiredXP) {
      this.level++;
      this.addXP(0);
    }
  }

  show() {
    const profile = super.show();

    // remove armor, weapon, skill and pet attribute
    profile.spliceFields(6, 4);

    profile.addField("\u200b", "\u200b");

    profile.addField(currency, code(this.coins), true);
    profile.addField("Win", code(this.win), true);

    profile.addField("Level", code(this.level), true);
    profile.addField("xp", `\`${this.xp}/${this.requiredXP()}\``, true);

    return profile;
  }

  save() {
    const { 
      user, 
      attack,
      hp,
      armor,
      critChance,
      critDamage,
      ...data
    } = this;

    if (data.pet) {
      data.pet.owner = undefined;
    }

    client.players.set(this.id, data);
  }
}

export class PlayerNotFoundErr extends Error {}
