import Pawn from '../Pawn';
import PawnAction, { IPawnActionProps } from './PawnAction';

interface IProps extends IPawnActionProps {
  target: Pawn;
}

class Attack extends PawnAction {
  target: Pawn;

  constructor ( { store, pawn, target }: IProps ) {
    super( { store, pawn } );
    this.target = target;
  }

  activate = async () => {
    const { ap, hp } = this.pawn.data;
    if ( !ap || !hp ) {
      this.done = true;
      return;
    }
    await this.dealDamage( this.target );
    this.done = true;
  }
}

export default Attack;
