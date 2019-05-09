import React, { Dispatch } from 'react';

import Auth from '../Auth';
import Game from '../game/Game';
import Store from '../Store';
import ClassSelect from './ClassSelect';

interface IProps {
  auth: Auth;
  store: Store;
  isAuthenticated: boolean;
  toggleShowMenu (): void;
}
// tslint:disable-next-line: typedef
function MainMenu ( { auth, store, isAuthenticated, toggleShowMenu }: IProps ) {
  const [ selectedClass, setSelectedClass ] = React.useState( '' );

  React.useEffect( () => {
    if ( selectedClass.length ) {
      store.updateUserData( { type: selectedClass } );
      store.game = new Game( store );
    }
  } );

  return (
    <div className='main-menu'>
      {
        ( isAuthenticated )
          ? `Logged in as ${ store.userData().name }`
          : <button
            disabled={ isAuthenticated }
            onClick={ auth.login }
          >
            Sign in to Dungeon
          </button>
      }
      <button
        disabled={ !selectedClass }
        onClick={ toggleShowMenu }
      >
        {
          ( selectedClass )
            ? 'Enter Game'
            : 'Select a class to play...'
        }
      </button>
      <ClassSelect
        store={ store }
        selectedClass={ selectedClass }
        setSelectedClass={ setSelectedClass }
      />
    </div>
  );
}

export default MainMenu;
