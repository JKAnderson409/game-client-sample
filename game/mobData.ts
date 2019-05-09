import { Coords } from './GameMap';

interface IMobData {
  type: string;
  maxAP: number;
  maxHP: number;
  positions: Coords[];
}

const mobGroups: IMobData[][] = [
  [
    {
      type: 'zombie_b',
      maxAP: 2,
      maxHP: 2,
      positions: [
        [ 5, 3 ]
      ]
    }
  ],
  [
    {
      type: 'zombie_a',
      maxAP: 2,
      maxHP: 2,
      positions: [
        [ 0, 1 ],
        [ 4, 2 ]
      ]
    },
    {
      type: 'zombie_b',
      maxAP: 2,
      maxHP: 2,
      positions: [
        [ 7, 1 ]
      ]
    }
  ]
];

export default mobGroups;
export { IMobData };
