import { Partie, Element, TypeElement, Simulation, EtatElementSimulation, calculFibonaci, StrategieHeroAvecCible } from '../src/codingame';

describe('codingame test ', () => {

  describe('teste les methodes du plus court chemin ', () => {
    xit('Le Hero doit se diriger vers l\'humain le plus proche ', () => {
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
      expect(zombieActualise?.element.position.positionX).toEqual(282);
      expect(zombieActualise?.element.position.positionY).toEqual(282);
      expect(zombieActualise?.element.getDistanceManathanByElement(initialZombie)).toBeLessThan(!!zombieActualise ? zombieActualise.element.getDistanceHopMax() : -1)
    })

    xit('le zombie doit avancer vers l\'humain et le tuer ', () => {
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
      expect(zombieActualise.element.position.positionX).toEqual(10);
      expect(zombieActualise.element.position.positionY).toEqual(10);
      expect(zombieActualise.element.getDistanceManathanByElement(initialZombie)).toBeLessThan(zombieActualise.element.getDistanceHopMax())
    })


    it('l\'hero doit tuer le zombie qui est dans sa range et avoir le score de 10 ', () => {
      // GIVEN 
      let simulateur = new Simulation()
      const initialZombie = new Element(0, 0, TypeElement.ZOMBIE);
      simulateur.simulationMap.push(new EtatElementSimulation(TypeElement.ZOMBIE, initialZombie));
      const initialHuman = new Element(0, 5000, TypeElement.HUMAN);
      simulateur.simulationMap.push(new EtatElementSimulation(TypeElement.HUMAN, initialHuman));
      const hero = new Element(1000, 0, TypeElement.HERO);
      simulateur.simulationMap.push(new EtatElementSimulation(TypeElement.HERO, hero));
      // WHEN
      simulateur.nextTurn();
      // THEN 
      const zombieActualise = simulateur.simulationMap[0];
      const heroActualise = simulateur.simulationMap[1];
      const humainActualise = simulateur.simulationMap[2];
      expect(zombieActualise.isDead).toBeTruthy();
      expect(simulateur.score).toBe(10);
    })



    it('l\'hero doit tuer les deux zombies qui est dans sa range et avoir le score de 120 ', () => {
      // GIVEN 
      let simulateur = new Simulation()
      const initialZombie = new Element(0, 0, TypeElement.ZOMBIE);
      simulateur.simulationMap.push(new EtatElementSimulation(TypeElement.ZOMBIE, initialZombie));
      const initialZombie2 = new Element(0, 0, TypeElement.ZOMBIE);
      simulateur.simulationMap.push(new EtatElementSimulation(TypeElement.ZOMBIE, initialZombie2));

      const initialZombie3 = new Element(0, 0, TypeElement.ZOMBIE);
      simulateur.simulationMap.push(new EtatElementSimulation(TypeElement.ZOMBIE, initialZombie3));

      const initialHuman = new Element(0, 5000, TypeElement.HUMAN);
      simulateur.simulationMap.push(new EtatElementSimulation(TypeElement.HUMAN, initialHuman));
      const initialHuman2 = new Element(0, 5000, TypeElement.HUMAN);
      simulateur.simulationMap.push(new EtatElementSimulation(TypeElement.HUMAN, initialHuman2));

      const hero = new Element(1000, 0, TypeElement.HERO);
      simulateur.simulationMap.push(new EtatElementSimulation(TypeElement.HERO, hero));
      // WHEN
      simulateur.nextTurn();
      // THEN 
      const zombieActualise = simulateur.simulationMap[0];
      const zombieActualise2 = simulateur.simulationMap[1];
      const zombieActualise3 = simulateur.simulationMap[2];
      const heroActualise = simulateur.simulationMap[4];
      const humainActualise = simulateur.simulationMap[5];
      const humainActualise2 = simulateur.simulationMap[6];
      expect(zombieActualise.isDead).toBeTruthy();
      expect(simulateur.score).toBe(120);
    })

    it('l\'hero doit tuer les trois zombies qui est dans sa range et avoir le score de 120 ', () => {
      // GIVEN 
      let simulateur = new Simulation()
      const initialZombie = new Element(0, 0, TypeElement.ZOMBIE);
      simulateur.simulationMap.push(new EtatElementSimulation(TypeElement.ZOMBIE, initialZombie));
      const initialZombie2 = new Element(0, 0, TypeElement.ZOMBIE);
      simulateur.simulationMap.push(new EtatElementSimulation(TypeElement.ZOMBIE, initialZombie2));

      const initialZombie3 = new Element(0, 0, TypeElement.ZOMBIE);
      simulateur.simulationMap.push(new EtatElementSimulation(TypeElement.ZOMBIE, initialZombie3));

      const initialHuman = new Element(0, 5000, TypeElement.HUMAN);
      simulateur.simulationMap.push(new EtatElementSimulation(TypeElement.HUMAN, initialHuman));
      const initialHuman2 = new Element(0, 5000, TypeElement.HUMAN);
      simulateur.simulationMap.push(new EtatElementSimulation(TypeElement.HUMAN, initialHuman2));

      const hero = new Element(1000, 0, TypeElement.HERO);
      simulateur.simulationMap.push(new EtatElementSimulation(TypeElement.HERO, hero));
      // WHEN
      simulateur.nextTurn();
      // THEN 
      const zombieActualise = simulateur.simulationMap[0];
      const zombieActualise2 = simulateur.simulationMap[1];
      const heroActualise = simulateur.simulationMap[2];
      const humainActualise = simulateur.simulationMap[3];
      const humainActualise2 = simulateur.simulationMap[4];
      expect(zombieActualise.isDead).toBeTruthy();
      expect(simulateur.score).toBe(120);
    })


    it('le zombie et le hero se dirige vers l\'humain', () => {
      // GIVEN 
      let simulateur = new Simulation()
      const initialZombie = new Element(0, 0, TypeElement.ZOMBIE);
      simulateur.simulationMap.push(new EtatElementSimulation(TypeElement.ZOMBIE, initialZombie));
      const initialHuman = new Element(0, 5000, TypeElement.HUMAN);
      simulateur.simulationMap.push(new EtatElementSimulation(TypeElement.HUMAN, initialHuman));
      const hero = new Element(5000, 5000, TypeElement.HERO);
      simulateur.simulationMap.push(new EtatElementSimulation(TypeElement.HERO, hero));
      // WHEN
      simulateur.nextTurn();
      // THEN 
      const zombieActualise = simulateur.simulationMap[0];
      const heroActualise = simulateur.simulationMap[2];
      const humainActualise = simulateur.simulationMap[1];
      expect(zombieActualise.isDead).toBeFalsy();
      expect(humainActualise.isDead).toBeFalsy();
      expect(zombieActualise.element.position.positionX).toBe(0);
      expect(zombieActualise.element.position.positionY).toBe(400);
      expect(heroActualise.element.position.positionX).toBe(4000);
      expect(heroActualise.element.position.positionY).toBe(5000);
    })

    it('le score total de la partie doit etre de 20', () => {
      // GIVEN 
      let simulateur = new Simulation()
      const initialZombie = new Element(0, 0, TypeElement.ZOMBIE);
      simulateur.simulationMap.push(new EtatElementSimulation(TypeElement.ZOMBIE, initialZombie));
      const initialHuman = new Element(0, 5000, TypeElement.HUMAN);
      simulateur.simulationMap.push(new EtatElementSimulation(TypeElement.HUMAN, initialHuman));
      const hero = new Element(5000, 5000, TypeElement.HERO);
      simulateur.simulationMap.push(new EtatElementSimulation(TypeElement.HERO, hero));
      // WHEN
      simulateur.playAllGame();
      // THEN 
      expect(simulateur.score).toBe(10)
    })

  })
});

describe('test de partie complexe',()=>{
  xit('simulation partie ', () => {
    // GIVEN 
    let simulateur = new Simulation()
    const initialZombie = new Element(2000, 1500, TypeElement.ZOMBIE);
    simulateur.simulationMap.push(new EtatElementSimulation(TypeElement.ZOMBIE, initialZombie));
    const initialZombie1 = new Element(7000, 7500, TypeElement.ZOMBIE);
    simulateur.simulationMap.push(new EtatElementSimulation(TypeElement.ZOMBIE, initialZombie1));
    const initialZombie2 = new Element(13900, 6500, TypeElement.ZOMBIE);
    simulateur.simulationMap.push(new EtatElementSimulation(TypeElement.ZOMBIE, initialZombie2));
    const initialHuman = new Element(9000, 1200, TypeElement.HUMAN);
    simulateur.simulationMap.push(new EtatElementSimulation(TypeElement.HUMAN, initialHuman));
    const initialHuman1 = new Element(400, 6000, TypeElement.HUMAN);
    simulateur.simulationMap.push(new EtatElementSimulation(TypeElement.HUMAN, initialHuman1));
    const hero = new Element(5000, 5000, TypeElement.HERO);
    simulateur.simulationMap.push(new EtatElementSimulation(TypeElement.HERO, hero));
    // WHEN
    simulateur.cible = initialHuman;
    simulateur.strategieHero = new StrategieHeroAvecCible();
    simulateur.playAllGame();
    // THEN 
    expect(simulateur.score).toBe(90)
  })
})

describe('fibonacci', () => {

  it('doit retourner 2 avec le parametre 3', () => {
    expect(calculFibonaci(3)).toBe(2)
  })

  
  it('doit retourner 5 avec le parametre 10', () => {
    expect(calculFibonaci(10)).toBe(55)
  })

})