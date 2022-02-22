import { MessageEmbed } from "discord.js";
import { random } from "../utils";
import { Bot } from "./Bot";


export class BattleField {
  static maxPlayers = 6;

  static get all() {
    return names.map((x, i) => new BattleFieldMap(x, i));
  }
}

class BattleFieldMap {
  name: string;
  minLevel: number;
  maxLevel: number;
  drop: number;
  xpDrop: number;
  players: Bot[] = [];

  constructor(name: string, index: number) {
    this.name = name;
    this.minLevel = index + index * 3;
    this.maxLevel = index + (index + 1) * 3;
    this.drop = (index + 1) * 30;
    this.xpDrop = (index + 1) * 3;

    for (let i = 0; i < BattleField.maxPlayers - 1; i++) {
      const botLevel = random.integer(this.minLevel, this.maxLevel);
      this.players.push(new Bot(botLevel));
    }
  }

  show() {
    const embed = new MessageEmbed()
      .setTitle(this.name)
      .setColor("RANDOM")
      .addField("Suggested level", `${this.minLevel} - ${this.maxLevel}`)

    return embed;
  }
}

const names = [
  "Fuel Plant",
  "Champs",
  "Eder Dam",
  "Mayenne",
  "Argentan",
  "Verdun",
  "Merville",
  "Les Ormes",
  "Rouen",
  "Poisson",
];
