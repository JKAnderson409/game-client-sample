import Store from '../../Store';
import { Coords } from '../GameMap';
import Pathfinder from '../Pathfinder';
import Pawn, { IPawnData } from '../Pawn';

interface IPawnActionProps {
  store: Store;
  pawn: Pawn;
}

abstract class PawnAction {
  pawn: Pawn;
  done: boolean = false;

  abstract target: Coords | Pawn;

  protected paths: Pathfinder;

  private store: Store;

  constructor ( { store, pawn }: IPawnActionProps ) {
    this.store = store;
    this.pawn = pawn;
  }

  abstract activate (): void;

  protected dealDamage = async ( targetPawn: Pawn ) => {
    // TODO: Re-integrate dealDamage logic
  }

  protected step = ( location: Coords ) => {
    const locationIsValid = this.validateLocation( location );

    if ( locationIsValid ) {
      this.store.updateUserData( { location } );
    } else {
      console.info( 'Cannot step there.' );
      return;
    }
  }

  private validateLocation ( location: Coords ): boolean {
    if ( location[ 0 ] > 84
      || location[ 0 ] < 46
      || location[ 1 ] > 84
      || location[ 1 ] < 46
    ) {
      return false;
    }

    return true;

    // return this.store.worldMobData().every(
    //   ( pawnData: IPawnData ) => {
    //     return !(
    //       ( location[ 0 ] === pawnData.location[ 0 ] ) &&
    //       ( location[ 1 ] === pawnData.location[ 1 ] )
    //     );
    //   }
    // );
  }
}

export default PawnAction;
export { IPawnActionProps };
