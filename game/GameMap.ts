import { Graphics, Sprite, Texture } from 'pixi.js';

import Store from '../Store';

type Coords = [ number , number ];

class GameMap {
  sprite: Sprite;
  grid: Graphics[];

  constructor ( store: Store, texture: Texture ) {
    const { game } = store;

    this.sprite = new Sprite( texture );

    game.stage.addChild( this.sprite );

    this.grid = [];



    this.sprite.on( 'click', () => {

    } );
  }
}

export default GameMap;
export { Coords };
