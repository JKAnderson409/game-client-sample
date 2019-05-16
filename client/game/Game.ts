import { Application, Texture, utils } from 'pixi.js';

import Store from '../Store';
import GameMap from './GameMap';
import Input from './Input';
import Pathfinder from './Pathfinder';
import Pawn, { IPawnData } from './Pawn';
import UserController from './UserController';

class Game extends Application {
  store: Store;
  input: Input;
  pathfinder: Pathfinder;
  viewHeight: number;
  viewWidth: number;

  setupHasRun: boolean = false;
  cameraSpeed: { x: number, y: number } = { x: 0, y: 0 };

  private windowResizeTimer: NodeJS.Timeout;

  constructor ( store: Store ) {
    super();

    delete store.game;
    utils.clearTextureCache();

    this.store = store;
    this.pathfinder = new Pathfinder( this.store );
    this.stage.scale.set( 1, 1 );
    this.viewWidth = window.innerWidth - 20;
    this.viewHeight = window.innerHeight - 20;

    window.onresize = this.onResize;

    this.ticker.add( () => {
      this.stage.x += this.cameraSpeed.x;
      this.stage.y += this.cameraSpeed.y;
    } );

    this.loader
      .add( 'garden', './src/client/assets/dungeonGarden.png' )
      .add( 'master', './src/client/assets/dungeon_sprites_master.json' )
      .load( this.setup );
  }

  private setup = ( _: never, { garden, master }: any ): void => {
    if ( this.setupHasRun ) { return; }
    this.setupHasRun = true;

    this.input = new Input( this.store );

    const animList = master.spritesheet.animations;
    const healthBar: Texture = master.textures[ 'uf_interface_159.png' ];

    this.store.gameMap = new GameMap( this.store, garden.texture );

    this.store.userController = new UserController( this.store );

    const userAnim: Texture[] = animList[ this.store.userData().type ];

    this.store.userPawn = new Pawn( {
      store: this.store,
      controller: this.store.userController,
      animation: userAnim,
      textures: [ healthBar ],
      fx: { attack: animList[ 'uf_FX_impact-1' ] },
      data: this.store.userData()
    } );

    this.handleResize();
  }

  private handleResize = (): void => {
    this.viewWidth = window.innerWidth - 20;
    this.viewHeight = window.innerHeight - 20;

    this.renderer.resize( this.viewWidth, this.viewHeight );
    this.input.cameraCenter();
  }

  private onResize = (): void => {
    clearTimeout( this.windowResizeTimer );

    this.windowResizeTimer = setTimeout(
      () => { this.handleResize(); },
      300
    );
  }
}

export default Game;
