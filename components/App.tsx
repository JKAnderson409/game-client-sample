import React, { Dispatch } from 'react';

import Auth from '../Auth';
import Store from '../Store';
import GameView from './GameView';
import MainMenu from './MainMenu';

interface IProps {
  auth: Auth;
  store: Store;
}

function _toggleSetting ( value: boolean, setter: Dispatch<boolean> ): void {
  setter( !value );
}

function toggleSetting ( value: boolean, setter: Dispatch<boolean> ): () => void {
  return _toggleSetting.bind( null, value, setter );
}
// tslint:disable-next-line: typedef
function App ( { auth, store }: IProps ) {
  const [ isAuthenticated, setIsAuthenticated ] = React.useState( false );
  const [ showMenu, setShowMenu ] = React.useState( true );

  React.useEffect( () => {
    auth.renewSession( setIsAuthenticated );
  } );

  return (
      <div className='app font1'>
        {
          ( showMenu )
            ? <MainMenu
              auth={ auth }
              store={ store }
              isAuthenticated={ isAuthenticated }
              toggleShowMenu={ toggleSetting( showMenu, setShowMenu ) }
            />
            : <GameView store={ store }/>
        }
      </div>

  );
}

export default App;
export { toggleSetting };
