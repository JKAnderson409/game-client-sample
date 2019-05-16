import React, { Dispatch } from 'react';

import { IPawnData } from '../game/Pawn';
import Store from '../Store';

interface IProps {
  store: Store;
  playerClassType: string;
  isSelected: boolean;
}

function ClassOption ( { store, playerClassType, isSelected }: IProps ): JSX.Element {

  const selectionStyle: string = isSelected ? 'selected' : '';

  return (
    <div
      className={ `class-option ${ playerClassType } ${ selectionStyle }` }
      onClick={ (): void => {
        store.updateUserData( { type: playerClassType } );
      } }
    >
      <p>{ playerClassType }</p>
    </div>
  );
}

export default ClassOption;
