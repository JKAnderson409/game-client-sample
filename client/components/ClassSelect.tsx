import React, { Dispatch, useEffect, useState } from 'react';

import { IPawnData } from '../game/Pawn';
import Store from '../Store';
import ClassOption from './ClassOption';

interface IProps {
  store: Store;
  userData: IPawnData;
}

const playableClassList: string[] = [
  'warrior_f',
  'archer',
  'thief',
  'priest',
  'wizard'
];

function ClassSelect ( { store, userData }: IProps ): JSX.Element {
  return (
    <div>
      <p>Select a class.</p>
      <div className='class-select'>
        {
          playableClassList.map( ( classType: string ) => {
            return <ClassOption
              key={ classType }
              store={ store }
              playerClassType={ classType }
              isSelected={ userData.type === classType }
            />;
          } )
        }
      </div>
    </div>
  );
}

export default ClassSelect;
