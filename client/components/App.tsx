import React, { Dispatch, SetStateAction } from 'react';

import Auth from '../Auth';
import Game from '../game/Game';
import Store, { defaultUserData } from '../Store';
import GameView from './GameView';
import MainMenu from './MainMenu';

type ReactSetter<T> = React.Dispatch<React.SetStateAction<T>>;

interface IProps {
  auth: Auth;
  store: Store;
}

function _toggleSetting ( value: boolean, setter: ReactSetter<boolean> ): void {
  setter( !value );
}

function toggleSetting ( value: boolean, setter: ReactSetter<boolean> ): () => void {
  return _toggleSetting.bind( null, value, setter );
}

function App ( { auth, store }: IProps ): JSX.Element {
  const [ isAuthenticated, setIsAuthenticated ] = React.useState( false );
  const [ gameIsActive, setGameIsActive ] = React.useState( false );
  const [ showMenu, setShowMenu ] = React.useState( true );
  const [ userData, setUserData ] = React.useState( defaultUserData );

  store.userDataUISync = setUserData;

  React.useEffect( () => {
    if ( !isAuthenticated ) {
      auth.renewSession()
        .catch( () => {
          console.info( 'Session renewal failed.' );
        } )
        .then( () => {
          setIsAuthenticated( auth.isAuthenticated() );
        } );
    }

    if ( gameIsActive && !store.game ) {
      const isConnectedToServer: boolean = store.socket.getIsConnected();

      if ( isConnectedToServer ) {
        store.game = new Game( store );
        setShowMenu( false );
      }
    }
  } );

  return (
      <div className='app font1'>
        {
          ( showMenu )
            ? <MainMenu
              auth={ auth }
              store={ store }
              isAuthenticated={ isAuthenticated }
              userData={ userData }
              setUserData={ setUserData }
              toggleGameIsActive={ toggleSetting( gameIsActive, setGameIsActive ) }
            />
            : <GameView store={ store }/>
        }
      </div>

  );
}

export default App;
export { ReactSetter, toggleSetting };
