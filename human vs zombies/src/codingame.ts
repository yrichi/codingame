import { isModeDev, readline } from "./dummy";

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
    HAUT = 0,
    HAUT_DIAGONAL_GAUCHE = 1,
    BAS = 2,
    BAS_DIAGONAL_GAUCHE = 3,
    GAUCHE = 4,
    HAUT_DIAGONAL_DROITE = 5,
    DROITE = 6,
    BAS_DIAGONAL_DROITE = 7,
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

    getNeigbourElementByDirection(element: Element, direction: Direction, facteur?: number): Element {
        let facteurMultiplication = !!facteur ? facteur : 1;
        if (!!facteur && (facteur / 4) <= 200) {
            facteurMultiplication = !!facteur ? facteur : 1;
        }
        switch (direction) {
            case (Direction.HAUT_DIAGONAL_GAUCHE):
                return new Element(element.position.positionX - 1 * facteurMultiplication, element.position.positionY + 1 * facteurMultiplication);
            case (Direction.GAUCHE):
                return new Element(element.position.positionX - 1 * facteurMultiplication, element.position.positionY);
            case (Direction.BAS_DIAGONAL_GAUCHE):
                return new Element(element.position.positionX - 1 * facteurMultiplication, element.position.positionY - 1 * facteurMultiplication);
            case (Direction.HAUT):
                return new Element(element.position.positionX, element.position.positionY + 1 * facteurMultiplication);
            case (Direction.BAS):
                return new Element(element.position.positionX, element.position.positionY - 1 * facteurMultiplication);
            case (Direction.HAUT_DIAGONAL_DROITE):
                return new Element(element.position.positionX + 1 * facteurMultiplication, element.position.positionY + 1 * facteurMultiplication);
            case (Direction.DROITE):
                return new Element(element.position.positionX + 1 * facteurMultiplication, element.position.positionY);
            case (Direction.BAS_DIAGONAL_DROITE):
                return new Element(element.position.positionX + 1 * facteurMultiplication, element.position.positionY - 1 * facteurMultiplication);
            default:
                console.error("voisin = cas non prevue ", direction)
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

    getNextHop(cible: Element): Element {
        const hypothenuse = this.getDistanceManathanByElement(cible);
        const x = this.position.positionX + this.getDistanceHopMax() * ((cible.position.positionX - this.position.positionX) / hypothenuse);
        const y = this.position.positionY + this.getDistanceHopMax() * ((cible.position.positionY - this.position.positionY) / hypothenuse);
        return new Element(Math.trunc(x),Math.trunc(y));
    }

    getDistanceHopMax(): number {
        switch (this.type) {
            case TypeElement.HERO:
                return 1000;
            case TypeElement.ZOMBIE:
                return 400;
            default:
                console.error("getDistanceHopMax cas non prevu ")
                return UNREACHABLE_VALUE; // TODO voir comment gerer ??a
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

    hero: Element;
    humans: Element[] = [];
    zombies: Element[] = [];


    makeADecision(): String {
        console.error("make a decision")
        let humansSauvable: Element[] = this.getHumansSauvable();
        let gestionSimulation = new GestionSimulation();
        console.error("nb humain" + humansSauvable.length)
        const findTheMostHumanToSave = humansSauvable.reduce((actualHuman, nextHuman) =>
            gestionSimulation.findScoreSimulation(this, actualHuman) <= gestionSimulation.findScoreSimulation(this, nextHuman)
                ? nextHuman : actualHuman);
        const coordonneResult = humansSauvable.length > 0 ? findTheMostHumanToSave.getCoordonneeString() : this.zombies[0].getCoordonneeString();
        return coordonneResult;
    }
    getHumansSauvable(): Element[] {
        return this.humans.filter((humain) => {
            const humanDistanceHero = humain.getNbTourByOtherElement(this.hero);
            const humanDistanceLePlusProcheZombie = humain.getDistanceOfElementLePlusProche(this.zombies);
            console.error(" humain sauvable");
            console.error(
                "human human" + humanDistanceHero +
                " human zombie" + humanDistanceLePlusProcheZombie +
                "on peut le sauver " +
                (humanDistanceHero <= humanDistanceLePlusProcheZombie ? "true" : "false"));
            return humanDistanceHero <= humanDistanceLePlusProcheZombie;
        });
    }

    fillZombies(zombieCount): void {
        for (let i = 0; i < zombieCount; i++) {
            var inputs: string[] = readline().split(' ');
            const zombieId: number = parseInt(inputs[0]);
            const zombieX: number = parseInt(inputs[1]);
            const zombieY: number = parseInt(inputs[2]);
            this.zombies.push(new Element(zombieX, zombieY, TypeElement.ZOMBIE))
            //const zombieXNext: number = parseInt(inputs[3]);
            //const zombieYNext: number = parseInt(inputs[4]);
            //this.zombies.push(new Element(zombieXNext, zombieYNext, TypeElement.ZOMBIE))
        }
        console.error("nbzombie " + this.zombies.length)
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



export class GestionSimulation {
    simulations: Simulation[] = [];

    findScoreSimulation(partie: Partie, cible: Element): number {
        const simulation = new Simulation();
        simulation.strategieHero = new StrategieHeroAvecCible();
        simulation.cible = cible;
        simulation.simulationMap.push(new EtatElementSimulation(TypeElement.HERO, partie.hero))
        partie.humans.forEach(humain => simulation.simulationMap.push(new EtatElementSimulation(TypeElement.HUMAN, humain)));
        partie.zombies.forEach(zombie => simulation.simulationMap.push(new EtatElementSimulation(TypeElement.ZOMBIE, zombie)));
        simulation.playAllGame();
        return simulation.score;
    }

}


const MAX_LOOP = 50;
export class Simulation {

    simulationMap: EtatElementSimulation[] = [];
    score = 0;
    strategieHero: StrategieHero = new StrategieHeroDefault();
    isGameFinished = false;
    cible: Element;


    playAllGame() {
        let nbLoop = 0;
        while (!this.isGameFinished ) {
            nbLoop++;
            this.nextTurn();
        }

        console.error("fin loop")
    }

    nextTurn() {
        const humans = this.getHumansAlive();
        const zombies = this.getZombiesAlive();
        console.error("humain alive " + this.getHumansAlive().length + "zombie alive " + this.getZombiesAlive().length)
        const hero = this.simulationMap.find(element => !element.isDead && (element.element.type === TypeElement.HERO));
        this.simulationMap.filter(etatElementSimulation => !etatElementSimulation.isDead).forEach((etat) => {
            switch (etat.element.type) {
                case TypeElement.HERO:
                    if (!!hero) {
                        this.strategieHero.apply(hero, humans, zombies, this.cible);
                        const nbZombiesKilledInSameTurn = this.killAnyZombieInTheRange(hero, zombies);
                        if (nbZombiesKilledInSameTurn > 0) {
                            this.score += this.calculerScore(humans, nbZombiesKilledInSameTurn)
                        }
                    }
                    break;
                case TypeElement.ZOMBIE:
                    const positionInitial = etat.element;
                    const nearestHuman = findTheNearestHuman(positionInitial, humans);
                    if (!!nearestHuman) {
                        if (nearestHuman.element.getDistanceManathanByElement(positionInitial) <= positionInitial.getDistanceHopMax()) {
                            etat.element.position.positionX = nearestHuman.element.position.positionX;
                            etat.element.position.positionY = nearestHuman.element.position.positionY;
                        } else {
                            const nextPosition = positionInitial.getNextHop(nearestHuman.element);
                            etat.element.position.positionX = nextPosition.position.positionX;
                            etat.element.position.positionY = nextPosition.position.positionY;
                        }
                        if (etat.element.getDistanceManathanByElement(nearestHuman.element) === 0) {
                            nearestHuman.isDead = true;
                        }
                    }
                    break;
                case TypeElement.HUMAN:
                    break;
                default:
                    console.error("type element => cas non prevue " + etat.element)
                    break;
            }
        })
        if (this.getHumansAlive().length == 0 || this.getZombiesAlive().length == 0) {
            console.error("tour fini")
            this.isGameFinished = true;
        }
    }



    private calculerScore(humans: EtatElementSimulation[], nbZombiesKilledInSameTurn: number) {
        return (Math.pow(humans.length, 2) * 10) * calculFibonaci(nbZombiesKilledInSameTurn + 1);
    }

    private getZombiesAlive() {
        return this.simulationMap.filter(zombie => !zombie.isDead && (zombie.element.type === TypeElement.ZOMBIE));
    }

    private getHumansAlive() {
        return this.simulationMap.filter(human => !human.isDead && (human.element.type === TypeElement.HUMAN));
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


export interface StrategieHero {
    apply(hero: EtatElementSimulation, humans: EtatElementSimulation[], zombies: EtatElementSimulation[], cible?: Element): void;

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
 * strategie simple, je vais defendre a partir d'un point precis, ??a va me permettre de tester plusieurs situation  vers une position fixe 
 */
export class StrategieHeroAvecCible implements StrategieHero {
    apply(hero: EtatElementSimulation, humans: EtatElementSimulation[], zombies: EtatElementSimulation[], cible: Element): void {

        if (cible.getDistanceOfElementLePlusProche(zombies.map(z => z.element)) < cible.getNbTourByOtherElement(hero.element)) {
            return;
        }

        if (hero.element.getDistanceManathanByElement(cible) <= hero.element.getDistanceHopMax()) {
            hero.element.position.positionX = cible.position.positionX;
            hero.element.position.positionY = cible.position.positionY;
        } else {
            const nextMove = hero.element.getNextHop(cible);
            hero.element.position.positionX = nextMove.position.positionX;
            hero.element.position.positionY = nextMove.position.positionY;
        }
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
    const start = Date.now();
    console.log(partie.makeADecision());     // Your destination coordinates
    const end = Date.now();
    console.error(`Temps total - Execution time: ${end - start} ms`);


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

