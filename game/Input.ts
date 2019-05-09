import { interaction } from 'pixi.js';

import Store from '../Store';
import Game from './Game';
import { Coords } from './GameMap';
import UserController from './UserController';

class Input {
  store: Store;
  interactionManager: interaction.InteractionManager;
  userController: UserController;

  constructor ( store: Store ) {
    this.store = store;
    this.userController = store.userController;

    window.onkeydown = this.keyDown;
    window.onkeyup = this.keyUp;
  }

  cameraCenter = (): void => {
    const playerLoc: Coords = this.store.userData().location;

    const globalPlayerX: number = playerLoc[ 0 ] * 24;
    const globalPlayerY: number = playerLoc[ 1 ] * 24;

    const { stage } = this.store.game;

    stage.x = 0 - globalPlayerX + ( window.innerWidth / 2 );
    stage.y = 0 - globalPlayerY + ( window.innerHeight / 2 );
  }

  private cameraMove = ( key: string ): void => {
    const { game } = this.store;

    switch ( key ) {
      case 'ArrowUp':
        game.cameraSpeed.y = 5;
        break;
      case 'ArrowDown':
        game.cameraSpeed.y = -5;
        break;
      case 'ArrowLeft':
        game.cameraSpeed.x = 5;
        break;
      case 'ArrowRight':
        game.cameraSpeed.x = -5;
        break;
    }
  }

  private cameraStop = ( key: string ): void => {
    const { game } = this.store;

    switch ( key ) {
      case 'ArrowUp':
        game.cameraSpeed.y = 0;
        break;
      case 'ArrowDown':
        game.cameraSpeed.y = 0;
        break;
      case 'ArrowLeft':
        game.cameraSpeed.x = 0;
        break;
      case 'ArrowRight':
        game.cameraSpeed.x = 0;
        break;
    }
  }

  private keyDown = ( e: KeyboardEvent ): void => {
    const isMovementKey: boolean =
      ( e.key === 'w' ) ||
      ( e.key === 'a' ) ||
      ( e.key === 's' ) ||
      ( e.key === 'd' );

    if ( e.key === 'c' ) {
      this.cameraCenter();
      return;
    }

    if ( isMovementKey ) {
      this.pawnMovement( e.key );
      return;
    }

    this.cameraMove( e.key );
  }

  private keyUp = ( e: KeyboardEvent ): void => {
    const isMovementKey: boolean =
      ( e.key === 'w' ) ||
      ( e.key === 'a' ) ||
      ( e.key === 's' ) ||
      ( e.key === 'd' );

    if ( !isMovementKey ) {
      this.cameraStop( e.key );
    }
  }

  private pawnMovement = ( key: string ): void => {
    switch ( key ) {
      case 'w':
        this.userController.step( 'UP' );
        break;
      case 's':
        this.userController.step( 'DOWN' );
        break;
      case 'a':
        this.userController.step( 'LEFT' );
        break;
      case 'd':
        this.userController.step( 'RIGHT' );
        break;
    }

    this.cameraCenter();
  }
}

export default Input;
