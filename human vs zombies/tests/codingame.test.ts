import { Partie, Element, TypeElement, Simulation, EtatElementSimulation } from '../src/codingame';

describe('codingame test ', () => {

  describe('teste les methodes du plus court chemin ', () => {
    test('Le Hero doit se diriger vers l\'humain le plus proche ', () => {
      // GIVEN
      let partie = new Partie();
      partie.zombies.push(new Element(0, 0, TypeElement.ZOMBIE));
      partie.humans.push(new Element(0, 10, TypeElement.HUMAN));
      partie.humans.push(new Element(0, 15, TypeElement.HUMAN));
      partie.hero = new Element(0, 5, TypeElement.HERO);
      // WHEN

      //THEN
      expect(partie.makeADecision()).toBe("0 10");
    });


    describe('test du simulateur', () => {
      it('le zombie doit avancer vers l\'humain en restant sous sa limite de 400 de portée', () => {
        // GIVEN 
        let simulateur = new Simulation()
        const initialZombie = new Element(0, 0, TypeElement.ZOMBIE);
        simulateur.simulationMap.push(new EtatElementSimulation(TypeElement.ZOMBIE, initialZombie));
        const initialHuman = new Element(10000, 10000, TypeElement.HUMAN);
        simulateur.simulationMap.push(new EtatElementSimulation(TypeElement.HUMAN, initialHuman));
        // WHEN
        simulateur.nextTurn();
        // THEN 
        const zombieActualise = simulateur.simulationMap[0];
        const HumainActualise = simulateur.simulationMap[1];
        expect(HumainActualise.isDead).toBeFalsy();
        expect(zombieActualise).toBeDefined();
        expect(zombieActualise?.element).toBeDefined();
        expect(zombieActualise?.element.positionX).toEqual(282);
        expect(zombieActualise?.element.positionY).toEqual(283);
        expect(zombieActualise?.element.getDistanceManathanByElement(initialZombie)).toBeLessThan(!!zombieActualise ? zombieActualise.element.getDistanceHop() : -1)
      })

      it('le zombie doit avancer vers l\'humain et le tuer ', () => {
        // GIVEN 
        let simulateur = new Simulation()
        const initialZombie = new Element(0, 0, TypeElement.ZOMBIE);
        simulateur.simulationMap.push(new EtatElementSimulation(TypeElement.ZOMBIE, initialZombie));
        const initialHuman = new Element(10, 10, TypeElement.HUMAN);
        simulateur.simulationMap.push(new EtatElementSimulation(TypeElement.HUMAN, initialHuman));
        // WHEN
        simulateur.nextTurn();
        // THEN 
        const zombieActualise = simulateur.simulationMap[0];
        const humainActualise = simulateur.simulationMap[1];
        expect(humainActualise.isDead).toBeTruthy();
        expect(zombieActualise).toBeDefined();
        expect(zombieActualise.element).toBeDefined();
        expect(zombieActualise.element.positionX).toEqual(10);
        expect(zombieActualise.element.positionY).toEqual(10);
        expect(zombieActualise.element.getDistanceManathanByElement(initialZombie)).toBeLessThan(zombieActualise.element.getDistanceHop())
      })
    })
  });
})