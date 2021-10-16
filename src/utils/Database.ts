type Fraction = {
    id: number;
    name: string;
    img: string;
    squads: Array<string>;
}

type Unit = {
    fractionId: number;
    squadName: string;
    unitName: string;
    hit: number;
    hp: number;
    magicDef: number;
    pic: string;
    shootAccuracy: number;
    shootRange: number;
    spells: Array<number>;
}

type Spell = {
    id: number;
    name: string | Array<string>;
    isMagic: boolean;
    range: number;
    direction: number;
    power: number;
}

type DB = {
    fractions: Array<Fraction>;
    units: Array<Unit>;
    spells: Array<Spell>;
}

class Database {
    private scene: Phaser.Scene;
    private db: DB = {
        fractions: [],
        units: [],
        spells: []
    };
    private cards: Array<string> = [];

    init(scene: Phaser.Scene) {
        this.scene = scene;
        this.db = scene.cache.json.get('db');
    }

    getFractions(): Array<Fraction> {
        return this.db.fractions;
    }

    getSquadUnits(squadName: string) {
        return this.db.units.filter(unit => unit.squadName === squadName);
    }

    loadCards(units: Array<Unit>): number {
        let needLoad: number = 0;

        units.forEach(unit => {
           if (this.cards.indexOf(unit.pic) === -1) {
               needLoad++;
               this.scene.load.image(`hero-${unit.pic}`, `../assets/img/heroes/${unit.pic}`);
           }
        });

        return needLoad;
    }
}

export default new Database();