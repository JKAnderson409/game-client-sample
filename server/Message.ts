import { IPawnData } from '../client/game/Pawn';
import { IStepData } from '../client/game/PawnActions/Step';

type MsgCategory = 'userData' | 'worldUserData';
type MsgContent = IPawnData[];

class Message {
  category: MsgCategory;
  content: MsgContent;

  constructor ( content: MsgContent | Set<IPawnData> ) {
    this.content = content instanceof Set ?
      Array.from( content ) :
      content;

    this.category = Array.isArray( this.content ) ?
      'worldUserData' :
      'userData';
  }
}

export default Message;
export { MsgCategory };
