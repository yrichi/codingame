import { Partie,Element,TypeElement } from '../src/codingame';

describe('teste les methodes du plus court chemin ', () => {
  test('Le Hero doit se diriger vers l\'humain le plus proche ', () => {
    // GIVEN
    let partie = new Partie();
    partie.zombies.push(new Element(0,0,TypeElement.ZOMBIE));
    partie.humans.push(new Element(0,10,TypeElement.HUMAN));
    partie.humans.push(new Element(0,15,TypeElement.HUMAN));
    partie.hero = new Element(0,5,TypeElement.HERO);
    // WHEN

    //THEN
    expect(partie.makeADecision()).toBe("0 10");
  });

  test('Le hero doit se diriger vers l\'humain le plus proche 2 ', () => {
    // GIVEN
    let partie = new Partie();
    partie.zombies.push(new Element(0,0,TypeElement.ZOMBIE));
    partie.humans.push(new Element(0,10,TypeElement.HUMAN));
    partie.hero = new Element(0,5,TypeElement.HERO);
    // WHEN

    //THEN

    expect(partie.makeADecision()).toBe("0 10");
  });

});