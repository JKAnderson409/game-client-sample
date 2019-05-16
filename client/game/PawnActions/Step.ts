import { Coords } from '../GameMap';
import PawnAction, { IPawnActionProps } from './PawnAction';

interface IProps extends IPawnActionProps {
  target: Coords;
}

interface IStepData {
  type: 'step';
  pawnName: string;
  target: Coords;
}

class Step extends PawnAction {
  target: Coords;

  constructor ( { store, pawn, target }: IProps ) {
    super( { store, pawn } );

    this.target = target;
  }

  activate = (): void => {
    this.step( this.target );
  }
}

export default Step;
export { IStepData };
