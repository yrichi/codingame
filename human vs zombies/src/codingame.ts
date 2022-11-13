
export const isModeDev = true;

export function readlineCustom(): string {
    return isModeDev ? "": readline();
}


export interface StrategieHero {
    apply(hero: EtatElementSimulation, humans: EtatElementSimulation[], zombies: EtatElementSimulation[]): void;

}

/**
 * ALGO BETE ET MECHANT , le hero va juste se diriger vers l'humain le plus proche pour le proteger 
 */
export class StrategieHeroDefault implements StrategieHero {
    apply(hero: EtatElementSimulation, humans: EtatElementSimulation[], zombies: EtatElementSimulation[]): void {


        const humanAbleToSave: EtatElementSimulation[] = [];
        humans.forEach(h => {
            const nearestZombie = h.element.getElementLePlusProche(zombies.map(zombie => zombie.element));
            if (!!nearestZombie && h.element.getNbTourByOtherElement(hero.element) <= nearestZombie.getNbTourByOtherElement(h.element)) {
                humanAbleToSave.push(h);
            }
        })

        if (!!humanAbleToSave?.length) {
            const humanToSave = humanAbleToSave
                .reduce((elementActual, elmentNext) =>
                    elementActual.element.getDistanceManathanByElement(hero.element) <= elmentNext.element.getDistanceManathanByElement(hero.element)
                        ? elementActual : elmentNext);

            if (hero.element.getDistanceManathanByElement(humanToSave.element) <= hero.element.getDistanceHopMax()) {
                hero.element.position.positionX = humanToSave.element.position.positionX;
                hero.element.position.positionY = humanToSave.element.position.positionY;
            } else {
                const nextMove = hero.element.getNextHop(humanToSave.element);
                hero.element.position.positionX = nextMove.position.positionX;
                hero.element.position.positionY = nextMove.position.positionY;
            }
        }
    }

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

const UNREACHABLE_VALUE = 10000000000;
export class Element {
    type: TypeElement;
    position: Position;

    constructor(x: number, y: number, typeElement?: TypeElement) {
        this.position = new Position(x, y);
        this.type = typeElement != null ? typeElement : TypeElement.POSITION;
    }

    getCoordonneeString(): string {
        return '' + this.position.positionX + ' ' + this.position.positionY;
    }

    getNbTourByOtherElement(element: Element) {
        const distance = this.getDistanceManathan(element.position.positionX, element.position.positionY);
        const nbTour = element.type === TypeElement.HERO ? (distance - 2000) / 1000 : distance / 400;
        return Math.ceil(nbTour % 1 != 0 ? nbTour + 1 : nbTour);
    }

    getDistanceManathanByElement(element: Element) {
        return this.getDistanceManathan(element.position.positionX, element.position.positionY);
    }

    getDistanceManathan(positionX, positionY) {
        return Math.sqrt(Math.abs(Math.pow(positionX - this.position.positionX, 2) + Math.pow(positionY - this.position.positionY, 2)));
    }

    getDistanceManathanByDirection(element: Element, direction: Direction): number {
        return this.getDistanceManathan(
            this.getNeigbourElementByDirection(element, direction).position.positionX,
            this.getNeigbourElementByDirection(element, direction).position.positionY)
    }

    getNeigbourElementByDirection(element: Element, direction: Direction): Element {
        switch (Number(direction)) {
            case (Direction.HAUT_DIAGONAL_GAUCHE):
                return new Element(element.position.positionX - 1, element.position.positionY + 1);
            case (Direction.GAUCHE):
                return new Element(element.position.positionX - 1, element.position.positionY);
            case (Direction.BAS_DIAGONAL_GAUCHE):
                return new Element(element.position.positionX - 1, element.position.positionY - 1);
            case (Direction.HAUT):
                return new Element(element.position.positionX, element.position.positionY + 1);
            case (Direction.BAS):
                return new Element(element.position.positionX, element.position.positionY - 1);
            case (Direction.HAUT_DIAGONAL_DROITE):
                return new Element(element.position.positionX + 1, element.position.positionY + 1);
            case (Direction.DROITE):
                return new Element(element.position.positionX + 1, element.position.positionY);

            case (Direction.BAS_DIAGONAL_DROITE):
                return new Element(element.position.positionX + 1, element.position.positionY - 1);
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


    // nextMove(element: Element): void {
    //     const distance = this.getNbTourByOtherElement(element);
    //     switch (this.type) {
    //         case TypeElement.HERO:
    //             if (distance <= this.getDistanceHop()) {
    //                 this.positionX = element.positionX;
    //                 this.positionY = element.positionY;
    //             } else {
    //                 const nextPosition: Element = this.getNextHop(element)
    //                 this.positionX = nextPosition.positionX;
    //                 this.positionY = nextPosition.positionY;
    //             };
    //             break;

    //         case TypeElement.ZOMBIE:
    //             break;
    //         default:
    //             break;
    //     }
    // }

    getNextHop(cible: Element): Element {

        let nextNeighbour = new Element(this.position.positionX, this.position.positionY);
        let isFinish = false;
        while (!isFinish) {
            let isFindNewNearestNeighbour = false;
            for (const direction in Direction) {
                const elementDirectNeighbour = this.getNeigbourElementByDirection(nextNeighbour, <Direction>+direction);
                if (elementDirectNeighbour.getDistanceManathanByElement(this) <= this.getDistanceHopMax()
                    && elementDirectNeighbour.getDistanceManathanByElement(cible) < nextNeighbour.getDistanceManathanByElement(cible)) {
                    nextNeighbour = elementDirectNeighbour;
                    isFindNewNearestNeighbour = true;
                }
            }
            if (!isFindNewNearestNeighbour) {
                isFinish = true;
            }
        }
        return nextNeighbour;
    }

    getDistanceHopMax(): number {
        switch (this.type) {
            case TypeElement.HERO:
                return 1000;
            case TypeElement.ZOMBIE:
                return 400;
            default:
                return UNREACHABLE_VALUE; // TODO voir comment gerer ça
        }
    }
}

export class Position {
    positionX: number;
    positionY: number;
    constructor(positionX, positionY) {
        this.positionX = positionX;
        this.positionY = positionY;
    }
}

export class Partie {


    makeADecision(): String {
        let humansSauvable: Element[] = this.humans.filter((humain) => {
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
            var inputs: string[] = readlineCustom().split(' ');
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
            var inputs: string[] = readlineCustom().split(' ');
            const humanId: number = parseInt(inputs[0]);
            const humanX: number = parseInt(inputs[1]);
            const humanY: number = parseInt(inputs[2]);
            this.humans.push(new Element(humanX, humanY, TypeElement.HUMAN));
        }
    }

}



export class Simulation {

    simulationMap: EtatElementSimulation[] = [];
    score = 0;
    // A ajouter la strategie attendu par le hero
    strategieHero: StrategieHero = new StrategieHeroDefault();

    nextTurn() {
        const humans = this.simulationMap.filter(human => !human.isDead && (human.element.type === TypeElement.HUMAN));
        const zombies = this.simulationMap.filter(zombie => !zombie.isDead && (zombie.element.type === TypeElement.ZOMBIE));
        const hero = this.simulationMap.find(zombie => !zombie.isDead && (zombie.element.type === TypeElement.HERO));
        this.simulationMap.filter(etatElementSimulation => !etatElementSimulation.isDead).forEach((etat) => {
            switch (etat.element.type) {
                case TypeElement.HERO:
                    if (!!hero) {
                        this.strategieHero.apply(hero, humans, zombies);
                        const nbZombiesKilledInSameTurn = this.killAnyZombieInTheRange(hero, zombies);
                        if(nbZombiesKilledInSameTurn>0){
                            this.score += (Math.pow(humans.length,2) * 10) * calculFibonaci(nbZombiesKilledInSameTurn + 2)
                        }
                    }
                    break;
                case TypeElement.ZOMBIE:
                    const positionInitial = etat.element;
                    const nearestHuman = findTheNearestHuman(positionInitial, humans);
                    if (!!nearestHuman) {
                        const nextPosition = positionInitial.getNextHop(nearestHuman.element);
                        etat.element.position.positionX = nextPosition.position.positionX;
                        etat.element.position.positionY = nextPosition.position.positionY;
                        if (etat.element.getDistanceManathanByElement(nearestHuman.element) === 0) {
                            nearestHuman.isDead = true;
                        }
                    }
                    break;
                default:
                    break;
            }
        })
        console.error('test ');
    }



    killAnyZombieInTheRange(hero: EtatElementSimulation, zombies: EtatElementSimulation[]): number {
        let nbZombies = 0;
        zombies.filter(zombie => zombie.element.getDistanceManathanByElement(hero.element) <= 2000)
            .forEach(zombie => {
                zombie.isDead = true;
                nbZombies++;
            });
        return nbZombies;
    }
}

export class EtatElementSimulation {
    element: Element;
    isDead: boolean;

    constructor(type: TypeElement, element: Element) {
        this.isDead = false;
        this.element = element;
    }
}


function initPartie(): Partie {
    let partie = new Partie();
    var inputs: string[] = readlineCustom().split(' ');
    const x: number = parseInt(inputs[0]);
    const y: number = parseInt(inputs[1]);
    partie.hero = new Element(x, y, TypeElement.HERO);
    const humanCount: number = parseInt(readlineCustom());
    partie.fillHumans(humanCount)
    const zombieCount: number = parseInt(readlineCustom());
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
    const etatElementHuman = humans.find(
        (human => human.element.position.positionX === nearestHuman.position.positionX &&
            human.element.position.positionY === nearestHuman.position.positionY));
    return etatElementHuman;

}


export function calculFibonaci(indice: number): number {
    if (indice == 0) {
        return 0;
    } else if (indice == 1) {
        return 1;
    }
    else {
        return calculFibonaci(indice - 1) + calculFibonaci(indice - 2);
    }
}

