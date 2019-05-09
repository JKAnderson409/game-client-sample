import React, { Dispatch, SetStateAction } from 'react';

import Store from '../Store';
import ClassOption from './ClassOption';

interface IProps {
  store: Store;
  selectedClass: null | string;
  setSelectedClass: Dispatch<SetStateAction<null | string>>;
}

const playableClassList: string[] = [
  'warrior_f',
  'archer',
  'thief',
  'priest',
  'wizard'
];
// tslint:disable-next-line: typedef
function CharacterCreator ( { store, selectedClass, setSelectedClass }: IProps ) {
  return (
    <div>
      <p>Select a class.</p>
      <div className='class-select'>
        {
          playableClassList.map( ( classType: string ) => {
            return <ClassOption
              key={ classType }
              playerClassType={ classType }
              selectedClass={ selectedClass }
              setSelectedClass={ setSelectedClass }
            />;
          } )
        }
      </div>
    </div>
  );
}

export default CharacterCreator;
