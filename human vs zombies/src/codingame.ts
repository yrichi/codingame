
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
    
     export class Element{
        type:TypeElement;
        positionX:number;
        positionY:number;
    
        constructor(x:number,y:number,typeElement: TypeElement){
            this.positionX = x;
            this.positionY = y;
            this.type = typeElement;
        }
    
        getCoordonneeString():string {
            return ''+this.positionX+' '+this.positionY;
        }
    
        getDistanceByOtherElement(element:Element){
            const distance =  Math.sqrt(Math.abs(Math.pow(element.positionX-this.positionX ,2) + Math.pow(element.positionY-this.positionY,2)));
            const nbTour =  element.type === TypeElement.HERO ? (distance-2000)/1000 : distance/400;
            return nbTour%1!=0 ? nbTour +1 : nbTour; 
        }
    
        getZombieLePlusProcheDistance(elements: Element[]): number {
            const zombie = elements.reduce( (p,v)=> this.lePlusProcheElement(p,v)?p:v)
            return this.getDistanceByOtherElement(zombie);
        }
    
        
        getZombieLePlusProche(elements: Element[]): Element {
            return  elements.reduce( (p,v)=> this.lePlusProcheElement(p,v)?p:v)
        }
    
    
        lePlusProcheElement(p: Element,v: Element) {
            return p.getDistanceByOtherElement(this)<v.getDistanceByOtherElement(this);
        }
    }
    
    export class Partie {
    
    
        makeADecision(): String {
            let humansSauvable = this.humans.filter((humain) => {
                const humanDistanceHero = humain.getDistanceByOtherElement(this.hero);
                const humanDistanceLePlusProcheZombie = humain.getZombieLePlusProcheDistance(this.zombies);
                console.error(" humain sauvable");
                console.error("human human"+humanDistanceHero+" human zombie"+humanDistanceLePlusProcheZombie+ "on peut le sauver "+(humanDistanceHero<=humanDistanceLePlusProcheZombie?"true":"false"));
                return humanDistanceHero < humanDistanceLePlusProcheZombie;
            });
            // TODO probleme de distance , ça marche pas 
            return humansSauvable.length > 0 ?humansSauvable[0].getCoordonneeString() :this.hero.getCoordonneeString();
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
                this.zombies.push(new Element(zombieX,zombieY,TypeElement.ZOMBIE))
                const zombieXNext: number = parseInt(inputs[3]);
                const zombieYNext: number = parseInt(inputs[4]);
                this.zombies.push(new Element(zombieXNext,zombieYNext,TypeElement.ZOMBIE))
            }
        }
        
         fillHumans(humanCount: number): void {
            for (let i = 0; i < humanCount; i++) {
                var inputs: string[] = readline().split(' ');
                const humanId: number = parseInt(inputs[0]);
                const humanX: number = parseInt(inputs[1]);
                const humanY: number = parseInt(inputs[2]);
                this.humans.push(new Element(humanX,humanY,TypeElement.HUMAN));
            }
        }
    
    }
    
    // game loop
    while (true && !isModeDev) {
        const partie = initPartie()
        
    
        // Write an action using console.log()
        // To debug: console.error('Debug messages...');
        console.log(partie.makeADecision());     // Your destination coordinates
    
    }
    
    
    function initPartie(): Partie {
        let partie = new Partie();
        var inputs: string[] = readline().split(' ');
        const x: number = parseInt(inputs[0]);
        const y: number = parseInt(inputs[1]);
        partie.hero = new Element(x,y,TypeElement.HERO);
        const humanCount: number = parseInt(readline());
        partie.fillHumans(humanCount)
        const zombieCount: number = parseInt(readline());
        partie.fillZombies(zombieCount);
        return partie;    
    }

    