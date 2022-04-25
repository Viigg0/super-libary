
class Player {
    #id;
    #playerName;
    #town;
    #mapCoordinates;
    #resources;
    #gold;
    #color;

    constructor(id, playerName, townName, x, y, color) {
        this.#playerName = playerName;
        this.#id = id;
        this.#town = new Town(playerName, id, townName, x, y);
        this.#mapCoordinates = [x, y];
        this.#resources = 10;
        this.#gold = 0;
        this.#color = color;
    }

    get id() {
        return this.#id;
    }
    set id(value) {
        this.#id = value;
    }
    get playerName() {
        return this.#playerName;
    }
    set playerName(value) {
        this.#playerName = value;
    }
    get town() {
        return this.#town;
    }
    set town(value) {
        this.#town = value;
    }
    get resources() {
        return this.#resources;
    }
    set resources(value) {
        this.#resources = value;
    }
    get gold() {
        return this.#gold;
    }
    set gold(value) {
        this.#gold = value;
    }
    get color() {
        return this.#color;
    }
    set color(value) {
        this.#color = value;
    }
}

class Town {

    #id;
    #owner;
    #townName;
    #troopsInside;
    #locationOnMap;
    #townHall;
    #baseField;
    #barracks;
    #type = "town";
    _visibleText = "Hello world";

    constructor(playerName, id, townName, x, y) {
        this.#id = id;
        this.#owner = playerName;
        this.#townName = townName;
        this.#troopsInside = 0;
        this.#locationOnMap = [x, y];
        this.#townHall = new Townhall();
        this.#baseField = new Basefield();
        this.#barracks = new Barracks();
    }

    get id() {
        return this.#id;
    }
    set id(value) {
        this.#id = value;
    }
    get townName() {
        return this.#townName;
    }
    set townName(value) {
        this.#townName = value;
    }
    get troopsInside() {
        return this.#troopsInside;
    }
    set troopsInside(value) {
        this.#troopsInside = value;
    }
    get locationOnMap() {
        return this.#locationOnMap;
    }
    set locationOnMap(value) {
        this.#locationOnMap = value;
    }
    get townHall() {
        return this.#townHall;
    }
    get baseField() {
        return this.#baseField;
    }
    get barracks() {
        return this.#barracks;
    }
    get visibleText() {
        return this._visibleText;
    }
    set visibleText(value) {
        this._visibleText = value;
    }
    get owner() {
        return this.#owner;
    }
    set owner(value) {
        this.#owner = value;
    }
    get type() {
        return this.#type;
    }
    set type(value) {
        this.#type = value;
    }
}

class Building {

    #lvl;
    #name;
    #upgradeCost = [0,0];

    constructor(name) {
        this.#lvl = 0;
        this.#name = name;
    }

    get name() {
        return this.#name;
    }
    set name(value) {
        this.#name = value;
    }
    get lvl() {
        return this.#lvl;
    }
    set lvl(value) {
        this.#lvl = value;
    }
    get upgradeCost() {
        return this.#upgradeCost;
    }
    set upgradeCost(value) {
        this.#upgradeCost = value;
    }
}

class Townhall extends Building {
    constructor() {
        super('Townhall');
        this.upgradeCost = [1,1];
    }
}

class Basefield extends Building {
    #resourcePerSec;

    constructor() {
        super('Basefield');
        this.#resourcePerSec = 1;
    }

    get resourcePerSec() {
        return this.#resourcePerSec;
    }
    set resourcePerSec(value) {
        this.#resourcePerSec = value;
    }
}

class Barracks extends Building {

    #trainingTime = 50;
    #queue = 0;
    #barrackInUse = false;
    #trainingTimeLeft = 0;
    #trainingCost = 1;

    constructor() {
        super('Barracks');
    }
    get queue() {
        return this.#queue;
    }
    set queue(value) {
        this.#queue = value;
    }
    get barrackInUse() {
        return this.#barrackInUse;
    }
    set barrackInUse(value) {
        this.#barrackInUse = value;
    }
    get trainingTime() {
        return this.#trainingTime;
    }
    set trainingTime(value) {
        this.#trainingTime = value;
    }
    get trainingTimeLeft() {
        return this.#trainingTimeLeft;
    }
    set trainingTimeLeft(value) {
        this.#trainingTimeLeft = value;
    }
    get trainingCost() {
        return this.#trainingCost;
    }
    set trainingCost(value) {
        this.#trainingCost = value;
    }

    newTrainTroops(town){
        console.log("Starting trainNewTroop ")
        this.queue = this.queue + 1;
        if (!this.barrackInUse){
            this.trainNextTroop(town);
        } else {
            console.log("Queue added!")
        }
    }

    trainNextTroop(town){
        console.log("Actually training");
        this.barrackInUse = true;
        this.trainingTimeLeft = this.trainingTime;
        let trainTimer = setInterval(()=>{
            if (this.trainingTimeLeft===6) {
                clearInterval(trainTimer);
                // increase troops by 1 ;
                town.troopsInside = town.troopsInside + 1;
                this.barrackInUse = false;
                console.log("Trained a troop! Troops are now: " + town.troopsInside);
                this.queue = this.queue - 1;
                if (this.queue > 0) {
                    this.trainNextTroop(town);
                }
            } else {
                this.trainingTimeLeft--;
            }
        },100);
    }


}

module.exports = {
    Player,
}