import { Command } from "@jiman24/commandment";
import { Player } from "../structure/Player";
import { Message } from "discord.js";
import { Pagination } from "../structure/Pagination";
import { TeamBattle } from "@jiman24/discordjs-rpg";
import { bold, currency, random } from "../utils";
import { BattleField } from "../structure/BattleField";

export default class extends Command {
  name = "battle";
  block: boolean = true;
  description = "fight in battlefield";
  aliases: string[] = ["b"];

  async exec(msg: Message) {

    const player = Player.fromUser(msg.author)
    const monsters = BattleField.all.map(x => x.show());
    const menu = new Pagination(msg, monsters, player.currentMonster);
    let battleField = BattleField.all[0];
    let position = 0;

    menu.setOnSelect((x) => {
      battleField = BattleField.all[x];
      position = x;
      player.currentMonster = x;
      player.save();
    });

    await menu.run();

    battleField.players.push(player);
    const players = random.shuffle(battleField.players);
    const middle = (BattleField.maxPlayers / 2) + 1;
    const teamA = { name: "A", fighters: players.slice(0, middle) };
    const teamB = { name: "B", fighters: players.slice(middle) }
    const playersTeam = teamA.fighters.some(x => x.id === player.id) ? teamA : teamB;

    const battle = new TeamBattle(msg, teamA, teamB);
    battle.setInterval(500);

    const winner = await battle.run();

    if (winner.name === playersTeam.name) {

      const currLevel = player.level;
      player.addXP(battleField.xpDrop);
      player.coins += battleField.drop;

      msg.channel.send(`${player.name} has earned ${bold(battleField.drop)} ${currency}!`);
      msg.channel.send(`${player.name} has earned ${bold(battleField.xpDrop)} xp!`);

      if (currLevel !== player.level) {
        msg.channel.send(`${player.name} is now on level ${bold(player.level)}!`);
      }

      player.currentMonster = position;
    }

    player.save();
  }
}
