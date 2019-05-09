import React, { Dispatch, SetStateAction } from 'react';

interface IProps {
  playerClassType: string;
  selectedClass: null | string;
  setSelectedClass: Dispatch<SetStateAction<null | string>>;
}
// tslint:disable-next-line: typedef
function ClassOption ( { playerClassType, selectedClass, setSelectedClass }: IProps ) {
  const isSelected: boolean = ( selectedClass === playerClassType );
  const selectionStyle: string = isSelected ? 'selected' : '';

  return (
    <div
      className={ `class-option ${ playerClassType } ${ selectionStyle }` }
      onClick={ (): void => { setSelectedClass( playerClassType ); } }
    >
      <p>{ playerClassType }</p>
    </div>
  );
}

export default ClassOption;
