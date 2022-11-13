
export const isModeDev = true;

export function readline(): string {
    return "";
}

/**
 * Save humans, destroy zombies!
 **/


export enum TypeElement {
    HUMAN,
    HERO,
    ZOMBIE,
    POSITION
}

export enum Direction {
    HAUT,
    HAUT_DIAGONAL_GAUCHE,
    BAS,
    BAS_DIAGONAL_GAUCHE,
    GAUCHE,
    HAUT_DIAGONAL_DROITE,
    DROITE,
    BAS_DIAGONAL_DROITE,
}

export class Element {
    type: TypeElement;
    positionX: number;
    positionY: number;

    constructor(x: number, y: number, typeElement?: TypeElement) {
        this.positionX = x;
        this.positionY = y;
        this.type = typeElement != null ? typeElement : TypeElement.POSITION;
    }

    getCoordonneeString(): string {
        return '' + this.positionX + ' ' + this.positionY;
    }

    getNbTourByOtherElement(element: Element) {
        const distance = this.getDistanceManathan(element.positionX, element.positionY);
        const nbTour = element.type === TypeElement.HERO ? (distance - 2000) / 1000 : distance / 400;
        return nbTour % 1 != 0 ? nbTour + 1 : nbTour;
    }

    getDistanceManathanByElement(element: Element) {
        return this.getDistanceManathan(element.positionX, element.positionY);
    }

    getDistanceManathan(positionX, positionY) {
        return Math.sqrt(Math.abs(Math.pow(positionX - this.positionX, 2) + Math.pow(positionY - this.positionY, 2)));
    }

    getDistanceManathanByDirection(element: Element, direction: Direction): number {
        return this.getDistanceManathan(this.getNeigbourElementByDirection(element, direction).positionX, this.getNeigbourElementByDirection(element, direction).positionY)
    }

    getNeigbourElementByDirection(element: Element, direction: Direction): Element {
        switch (Number(direction)) {
            case (Direction.HAUT_DIAGONAL_GAUCHE):
                return new Element(element.positionX - 1, element.positionY + 1);
            case (Direction.GAUCHE):
                return new Element(element.positionX - 1, element.positionY);
            case (Direction.BAS_DIAGONAL_GAUCHE):
                return new Element(element.positionX - 1, element.positionY - 1);
            case (Direction.HAUT):
                return new Element(element.positionX, element.positionY + 1);
            case (Direction.BAS):
                return new Element(element.positionX, element.positionY - 1);
            case (Direction.HAUT_DIAGONAL_DROITE):
                return new Element(element.positionX + 1, element.positionY + 1);
            case (Direction.DROITE):
                return new Element(element.positionX + 1, element.positionY);

            case (Direction.BAS_DIAGONAL_DROITE):
                return new Element(element.positionX + 1, element.positionY - 1);
            default:
                return new Element(100000000, 10000000000); // TODO revoir ce point
        }
    }




    getDistanceOfElementLePlusProche(elements: Element[]): number {
        const zombie = elements.reduce((p, v) => this.lePlusProcheElement(p, v) ? p : v)
        return this.getNbTourByOtherElement(zombie);
    }


    getElementLePlusProche(elements: Element[]): Element {
        return elements.reduce((p, v) => this.lePlusProcheElement(p, v) ? p : v)
    }


    lePlusProcheElement(p: Element, v: Element): boolean {
        return p.getNbTourByOtherElement(this) < v.getNbTourByOtherElement(this);
    }


    nextMove(element: Element): void {
        const distance = this.getNbTourByOtherElement(element);
        switch (this.type) {
            case TypeElement.HERO:
                if (distance <= this.getDistanceHop()) {
                    this.positionX = element.positionX;
                    this.positionY = element.positionY;
                } else {
                    const nextPosition: Element = this.getNextHop(element)
                    this.positionX = nextPosition.positionX;
                    this.positionY = nextPosition.positionY;
                };
                break;

            case TypeElement.ZOMBIE:
                break;
            default:
                break;
        }
    }
    getNextHop(cible: Element): Element {
        // TODO a delete log
        let nextNeighbourDebug: Element[] = []
        //
        let nextNeighbour = new Element(this.positionX, this.positionY);
        let isFinish = false;
        while (!isFinish) {
            let isFindNewNearestNeighbour = false;
            for (const direction in Direction) {
                const elementDirectNeighbour = this.getNeigbourElementByDirection(nextNeighbour, <Direction>+direction);
                if (elementDirectNeighbour.getDistanceManathanByElement(this) <= this.getDistanceHop()
                    && elementDirectNeighbour.getDistanceManathanByElement(cible) < nextNeighbour.getDistanceManathanByElement(cible)) {
                    nextNeighbour = elementDirectNeighbour;
                    isFindNewNearestNeighbour = true;

                    // TODO a delete 
                    nextNeighbourDebug.push(nextNeighbour);
                }
            }
            if (!isFindNewNearestNeighbour) {
                isFinish = true;
            }
        }

        // TODO a delete 
        console.debug(nextNeighbourDebug)
        return nextNeighbour;
    }

    getDistanceHop(): number {
        switch (this.type) {
            case TypeElement.HERO:
                return 1000;
            case TypeElement.ZOMBIE:
                return 400;
            default:
                return 10000000000; // TODO voir comment gerer ça
        }
    }
}

export class Partie {


    makeADecision(): String {
        let humansSauvable = this.humans.filter((humain) => {
            const humanDistanceHero = humain.getNbTourByOtherElement(this.hero);
            const humanDistanceLePlusProcheZombie = humain.getDistanceOfElementLePlusProche(this.zombies);
            console.error(" humain sauvable");
            console.error("human human" + humanDistanceHero + " human zombie" + humanDistanceLePlusProcheZombie + "on peut le sauver " + (humanDistanceHero <= humanDistanceLePlusProcheZombie ? "true" : "false"));
            return humanDistanceHero < humanDistanceLePlusProcheZombie;
        });
        // TODO probleme de distance , ça marche pas 
        return humansSauvable.length > 0 ? humansSauvable[0].getCoordonneeString() : this.zombies[0].getCoordonneeString();
    }
    hero: Element;
    humans: Element[] = [];
    zombies: Element[] = [];


    fillZombies(zombieCount): void {
        for (let i = 0; i < zombieCount; i++) {
            var inputs: string[] = readline().split(' ');
            const zombieId: number = parseInt(inputs[0]);
            const zombieX: number = parseInt(inputs[1]);
            const zombieY: number = parseInt(inputs[2]);
            this.zombies.push(new Element(zombieX, zombieY, TypeElement.ZOMBIE))
            const zombieXNext: number = parseInt(inputs[3]);
            const zombieYNext: number = parseInt(inputs[4]);
            this.zombies.push(new Element(zombieXNext, zombieYNext, TypeElement.ZOMBIE))
        }
    }

    fillHumans(humanCount: number): void {
        for (let i = 0; i < humanCount; i++) {
            var inputs: string[] = readline().split(' ');
            const humanId: number = parseInt(inputs[0]);
            const humanX: number = parseInt(inputs[1]);
            const humanY: number = parseInt(inputs[2]);
            this.humans.push(new Element(humanX, humanY, TypeElement.HUMAN));
        }
    }

}


export class Simulation {

    simulationMap: EtatElementSimulation[];
    score: number;
    // A ajouter la strategie attendu par le hero
    constructor() {
        this.simulationMap = [];
    }

    nextTurn() {
        const humans = this.simulationMap.filter(humans => !humans.isDead && (humans.element.type === TypeElement.HUMAN || humans.element.type === TypeElement.HERO))
        this.simulationMap.forEach((etat) => {
            switch (etat.element.type) {
                case TypeElement.HERO:
                    break;
                case TypeElement.ZOMBIE:
                    const positionInitial = etat.element;
                    const nearestHuman = findTheNearestHuman(positionInitial, humans);
                    if (!!nearestHuman) {
                        const nextPosition = positionInitial.getNextHop(nearestHuman.element);
                        etat.element.positionX = nextPosition.positionX;
                        etat.element.positionY = nextPosition.positionY;
                        if (etat.element.getDistanceManathanByElement(nearestHuman.element) === 0) {
                            nearestHuman.isDead = true;
                        }
                    }

                    break;
                default:
                    break;
            }
        })
    }
}

export class EtatElementSimulation {
    element: Element
    isDead: boolean;

    constructor(type: TypeElement, element: Element) {
        this.isDead = false;
        this.element = element;
    }
}


function initPartie(): Partie {
    let partie = new Partie();
    var inputs: string[] = readline().split(' ');
    const x: number = parseInt(inputs[0]);
    const y: number = parseInt(inputs[1]);
    partie.hero = new Element(x, y, TypeElement.HERO);
    const humanCount: number = parseInt(readline());
    partie.fillHumans(humanCount)
    const zombieCount: number = parseInt(readline());
    partie.fillZombies(zombieCount);
    return partie;
}

// game loop
while (true && !isModeDev) {
    const partie = initPartie()


    // Write an action using console.log()
    // To debug: console.error('Debug messages...');
    console.log(partie.makeADecision());     // Your destination coordinates

}

function findTheNearestHuman(positionInitial: Element, humans: EtatElementSimulation[]): EtatElementSimulation | undefined {
    const humansElement = humans.map((element) => element.element);
    const nearestHuman = positionInitial.getElementLePlusProche(humansElement);
    const etatElementHuman = humans.find((human => human.element.positionX === nearestHuman.positionX && human.element.positionY === nearestHuman.positionY));
    return etatElementHuman;

}


