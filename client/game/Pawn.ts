import { AnimatedSprite, Sprite, Text, Texture } from 'pixi.js';

import Store from '../Store';
import { Coords } from './GameMap';
import UserController from './UserController';

interface IProps {
  store: Store;
  animation: Texture[];
  controller: UserController | null;
  data: IPawnData;
  textures: Texture[];
  fx: IFX;
}

interface IFX {
  attack: Texture[];
}

interface IPawnData {
  name: string;
  type: string;
  ap: number;
  maxAP: number;
  hp: number;
  maxHP: number;
  speed: number;
  location: Coords;
}

interface IPawnDataUpdate {
  name?: string;
  type?: string;
  ap?: number;
  maxAP?: number;
  hp?: number;
  maxHP?: number;
  speed?: number;
  location?: Coords;
}

class Pawn {
  name: string;
  type: string;
  controller: UserController | null;
  data: IPawnData;

  apText: Text;
  hpText: Text;
  sprite: AnimatedSprite;
  healthBar: Sprite;
  healthBarFullWidth: number;
  fx: IFX;

  private store: Store;

  constructor ( props: IProps ) {
    const { game } = props.store;

    this.store = props.store;
    this.name = props.data.name;
    this.type = props.data.type;
    this.controller = props.controller;
    this.data = props.data;
    this.fx = props.fx;

    this.sprite = new AnimatedSprite( props.animation );
    this.sprite.animationSpeed = 0.125;
    this.sprite.interactive = true;
    this.sprite.play();
    this.sprite = this.sprite;

    game.stage.addChild( this.sprite );

    this.healthBar = new Sprite( props.textures[ 0 ] );
    game.stage.addChild( this.healthBar );

    this.hpText = new Text(
      '',
      {
        fontFamily: 'Germania One',
        fontSize: 14,
        fill: 0xff4444,
        alpha: 0.9
      }
    );
    game.stage.addChild( this.hpText );

    this.apText = new Text(
      '',
      {
        fontFamily: 'Germania One',
        fontSize: 14,
        fill: 0xd49900,
        alpha: 0.9
      }
    );
    game.stage.addChild( this.apText );

    game.stage.swapChildren( this.sprite, this.hpText );

    this.setPosition();
    this.updateUI();
  }

  animateAttack = ( target: Pawn ): Promise<void> => {
    const { scale } = target.sprite;

    const targetCoords: Coords = target.data.location;
    const boardPosition: Coords = this.data.location;

    const direction: string = ( targetCoords[ 0 ] > boardPosition[ 0 ] )
      ? 'right'
      : ( targetCoords[ 0 ] < boardPosition[ 0 ] )
        ? 'left'
        : ( targetCoords[ 1 ] > boardPosition[ 1 ] )
          ? 'down'
          : 'up';

    const vx: number = ( direction === 'left' )
      ? -6 * scale.x
      : ( direction === 'right' )
        ? 6 * scale.x
        : 0;

    const vy: number = ( direction === 'up' )
      ? -6 * scale.y
      : ( direction === 'down' )
        ? 6 * scale.y
        : 0;

    return new Promise( ( resolve ) => {
      for ( let i = 0; i <= 6; i++ ) {
        setTimeout( () => {
          this.sprite.x += vx;
          this.sprite.y += vy;
        }, 5 * i );

        setTimeout( () => {
          this.sprite.x -= vx;
          this.sprite.y -= vy;
          if ( i === 6 ) {
            resolve();
          }
        }, 5 * i * 2 );
      }
    } );
  }

  animateDamage = (): Promise<void> => new Promise ( ( resolve ): void => {
    const { scale, x, y } = this.sprite;

    this.sprite.tint = 0x9a0407;

    for ( let i = 0; i <= 5; i++ ) {
      setTimeout( () => {
        this.sprite.alpha = ( this.sprite.alpha )
          ? 0
          : 1;

        if ( i === 5 ) {
          this.sprite.tint = 0xFFFFFF;
        }
      }, 75 * i );
    }

    const damageSprite = new AnimatedSprite( this.fx.attack );
    this.store.game.stage.addChild( damageSprite );

    damageSprite.setTransform( x, y, scale.x, scale.y );
    damageSprite.onLoop = async () => {
      await damageSprite.destroy();
      resolve();
    };
    damageSprite.animationSpeed = 0.2;
    damageSprite.gotoAndPlay( 0 );
  } )

  destroy = (): void => {
    this.sprite.interactive = false;
    this.sprite.alpha = 0;
    this.healthBar.alpha = 0;
    this.apText.alpha = 0;
    this.hpText.alpha = 0;
  }

  setPosition = (): void => {
    if ( !this.healthBarFullWidth ) {
      this.healthBarFullWidth = this.sprite.width * 0.8;
    }

    const x: number = this.data.location[ 0 ] * 24;
    const y: number = this.data.location[ 1 ] * 24;

    this.sprite.setTransform( x, y );
    this.updateUI();
  }

  updateUI = (): void => {
    const { ap, maxAP, hp, maxHP, location }: IPawnData = this.data;

    const x: number = location[ 0 ] * 24;
    const y: number = location[ 1 ] * 24;
    const apTextXOffset: number = ( this.sprite.width * 0.6 );
    const hpTextXOffset: number = ( this.sprite.width * 0.075 );
    const healthBarX: number = x + ( this.sprite.width * 0.1 );
    const healthBarY: number = y + ( this.sprite.height * 0.9 );
    const healthRatio: number = hp / maxHP;

    this.healthBar.setTransform( healthBarX, healthBarY );
    this.healthBar.width = this.healthBarFullWidth  * healthRatio ;

    this.hpText.text = `${ hp }|${ maxHP }`;
    this.hpText.setTransform( x + hpTextXOffset, y );

    if ( this.apText ) {
      this.apText.text = `${ ap }|${ maxAP }`;
      this.apText.setTransform( x + apTextXOffset, y );
    }
  }
}

export default Pawn;
export { IFX, IPawnData, IPawnDataUpdate };
