export function genUsername(): string {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = animals[Math.floor(Math.random() * animals.length)];
  const id = Math.floor(Math.random() * 10000000); // Generate a random ID between 0 and 9999999

  return `${adjective}${noun}${id}`;
}

var adjectives: string[] = [
  'Adroit',
  'Bold',
  'Chivalrous',
  'Daring',
  'Eloquent',
  'Fearless',
  'Gallant',
  'Honorable',
  'Indomitable',
  'Just',
  'Knightly',
  'Lionhearted',
  'Majestic',
  'Noble',
  'Opulent',
  'Powerful',
  'Regal',
  'Stalwart',
  'Tenacious',
  'Upright',
  'Valiant',
  'Wise',
  'Xalted',
  'Youthful',
  'Zealous',
];

var animals: string[] = [
  'Axolotl',
  'Binturong',
  'Coati',
  'Dolphin',
  'Echidna',
  'Fossa',
  'Gharial',
  'Hoatzin',
  'Ibex',
  'Jerboa',
  'Kinkajou',
  'Lemur',
  'Marmoset',
  'Numbat',
  'Okapi',
  'Pangolin',
  'Quokka',
  'Rhino',
  'Serval',
  'Tapir',
  'Uakari',
  'Vicuña',
  'Wallaby',
  'Xenopus',
  'Yak',
  'Zorilla',
];
