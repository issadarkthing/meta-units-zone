import { Weapon as BaseWeapon } from "@jiman24/discordjs-rpg";
import { Player } from "../structure/Player";
import { Item } from "./Item";
import { applyMixins } from "../utils";

export interface Weapon extends Item {};

export abstract class Weapon extends BaseWeapon {
  abstract price: number;

  static get all(): Weapon[] {
    return weaponData.map(x => new WeaponItem(x));
  }

  apply(player: Player) {
    player.attack += this.attack;
  }
}

applyMixins(Weapon, [Item]);


interface WeaponData {
  readonly id: string;
  readonly name: string;
  readonly attack: number;
  readonly price: number;
}

class WeaponItem extends Weapon {
  id: string;
  name: string;
  price: number;

  constructor(data: WeaponData) {
    super();

    this.id = data.id;
    this.name = data.name;
    this.attack = data.attack;
    this.price = data.price;
  }
};

const weaponData: WeaponData[] = [
  {
    id: "glock",
    name: "Glock",
    attack: 20,
    price: 1000,
  },
  {
    id: "ump-45",
    name: "UMP 45",
    attack: 30,
    price: 2000,
  },
  {
    id: "magnum-sniper-rifle",
    name: "Magnum Sniper Rifle",
    attack: 40,
    price: 3000,
  },
  {
    id: "m-249",
    name: "M249",
    attack: 50,
    price: 4000,
  },
];

