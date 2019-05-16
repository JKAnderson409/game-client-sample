import flyd from 'flyd';

import { ReactSetter } from './components/App';
import Game from './game/Game';
import GameMap from './game/GameMap';
import Pawn, { IPawnData, IPawnDataUpdate } from './game/Pawn';
import UserController from './game/UserController';
import Socket from './Socket';

const defaultUserData: IPawnData = {
  name: '',
  type: '',
  ap: 0,
  maxAP: 0,
  hp: 0,
  maxHP: 0,
  speed: 0,
  location: [ 60, 60 ]
};

type Stream<T> = flyd.Stream<T>;

class Store {
  game: Game;
  gameMap: GameMap;

  userPawn: Pawn;
  userData: Stream<IPawnData> = flyd.stream( defaultUserData );
  userController: UserController = new UserController( this );

  worldUserData: Stream<IPawnData[]> = flyd.stream( [] );

  socket: Socket = new Socket( this );

  userDataUISync: ReactSetter<IPawnData> | null = null;

  updateUserData = ( userDataUpdate: IPawnDataUpdate ): void => {
    const prevUserData: IPawnData = this.userData();
    const newUserData: IPawnData = {
      ...prevUserData,
      ...userDataUpdate
    };

    this.userData( newUserData );

    if ( this.userPawn ) {
      this.userPawn.data = newUserData;
      this.userPawn.setPosition();
    }

    if ( this.userDataUISync ) {
      this.userDataUISync( newUserData );
    }

  }

  activateActionFromServer = (): void => {}

  getUserDataByName ( name: string ): IPawnData | null {
    if ( name === this.userData().name ) {
      return this.userData();
    }

    const result: IPawnData | undefined = this.worldUserData().find(
      ( pawn: IPawnData ) => pawn.name === name
    );

    return result || null;
  }
}

export default Store;
export { defaultUserData, Stream };
