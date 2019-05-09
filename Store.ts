import flyd from 'flyd';

import { IActionMessage } from '../server/GameServer';

import Game from './game/Game';
import GameMap, { Coords } from './game/GameMap';
import Pawn, { IPawnData } from './game/Pawn';
import Step, { IStepData } from './game/PawnActions/Step';
import UserController from './game/UserController';

type Stream<T> = flyd.Stream<T>;

interface IPawnDataUpdate {
  name?: string;
  type?: string;
  ap?: number;
  maxAP?: number;
  hp?: number;
  maxHP?: number;
  location?: Coords;
}

const defaultLocation: Coords = [ 46, 46 ];

class Store {
  game: Game;
  userPawn: Pawn;
  userController: UserController = new UserController( this );

  userData: Stream<IPawnData> = flyd.stream(
    {
      name: 'Jeff',
      type: 'knight',
      ap: 10,
      maxAP: 25,
      hp: 9,
      maxHP: 19,
      speed: 5,
      location: defaultLocation
    }
  );

  userDataEffects = flyd.on( ( newData: IPawnData ) => {
    if ( this.userPawn ) {
      this.userPawn.data = newData;

      if ( newData.location ) {
        this.userPawn.setPosition();
      }
    }
  }, this.userData );

  gameMap: GameMap;
  pawnList: Stream<Pawn[]> = flyd.stream( [] );

  worldPawnData: Stream<IPawnData[]> = flyd.stream( [] );

  enqueueAction: Stream<IStepData> = flyd.stream();

  actionQueue: Stream<IStepData[]> = flyd.scan(
    ( queue: IStepData[], action: IStepData ) => {
      const newQueue: IStepData[] = queue.concat( [ action ] );

      const step: Step = new Step( {
        store: this,
        pawn: this.userPawn,
        ...action
      } );

      step.activate();

      return newQueue;
    },
    [],
    this.enqueueAction
  );

  webSocket: WebSocket = new WebSocket( 'ws://localhost:4040' );

  constructor () {
    this.webSocket.onopen = ( e: Event ): void => {
      console.info( 'Connected to server' );
    };

    this.webSocket.onclose = (): void => {
      console.info( 'Disconnected from server' );
    };

    this.webSocket.onmessage = ( e: MessageEvent ): void => {
      const message = JSON.parse( e.data );
      const { msgType, content } = message;

      if ( msgType === 'worldPawnData' ) {
        this.worldPawnData( content );
      }

      if ( msgType === 'action' ) {
        this.dispatchAction( content );
      }
    };
  }

  updateUserData = ( newUserData: IPawnDataUpdate ): void => {
    const currentUserData: IPawnData = this.userData();

    this.userData( {
      ...currentUserData,
      ...newUserData
    } );
  }

  syncQueuedActionData = (): void => {
    const actionQueue: IStepData[] = this.actionQueue();
    const nextActionData: IStepData | undefined = actionQueue.shift();

    if ( !nextActionData ) {
      return;
    }

    this.actionQueue( actionQueue );

    this.updateServer( {
      msgType: 'action',
      content: nextActionData
    } );
  }

  private dispatchAction ( { pawnName, target }: IStepData ): void {
    const pawn: Pawn | null = this.getPawnByName( pawnName );

    if ( !pawn ) {
      console.error( 'Action dispatch failed, pawn not found.' );
      return;
    }

    const action: Step = new Step( {
      store: this,
      pawn,
      target
    } );

    action.activate();
  }

  private getPawnByName ( name: string ): Pawn | null {
    if ( name === this.userData().name ) {
      return this.userPawn;
    }

    const result: Pawn | undefined = this.pawnList().find(
      ( pawn: Pawn ) => pawn.name === name
    );

    return result || null;
  }

  private updateServer ( message: IActionMessage ): void {
    this.webSocket.send( JSON.stringify( message ) );
  }
}

export default Store;
export { Stream };
