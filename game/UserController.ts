import Store from '../Store';
import { Coords } from './GameMap';
import Input from './Input';

class UserController {
  store: Store;

  private actionTicker: NodeJS.Timeout;
  private prevTarget: Coords;

  constructor ( store: Store ) {
    this.store = store;
  }

  step ( direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | null ) {
    const location: Coords = this.store.userData().location;
    const target: Coords = [ location[ 0 ], location[ 1 ] ];

    switch ( direction ) {
      case ( 'UP' ):
        target[ 1 ] -= 1;
        break;

      case ( 'DOWN' ):
        target[ 1 ] += 1;
        break;

      case ( 'LEFT' ):
        target[ 0 ] -= 1;
        break;

      case ( 'RIGHT' ):
        target[ 0 ] += 1;
        break;
    }

    if ( this.prevTarget ) {
      if ( target[ 0 ] === this.prevTarget[ 0 ]
        && target[ 1 ] === this.prevTarget[ 1 ]
      ) {
        return;
      }
    }

    this.prevTarget = target;

    this.store.enqueueAction( {
      type: 'step',
      pawnName: this.store.userData().name,
      target
    } );
  }
}

export default UserController;
