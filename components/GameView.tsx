import React, { MutableRefObject } from 'react';

import Auth from '../Auth';
import Store, { Stream } from '../Store';

interface IProps {
  store: Store;
}
// tslint:disable-next-line: typedef
function GameView ( { store }: IProps ) {
  const canvasAnchor: MutableRefObject<HTMLDivElement> = React.useRef(
    document.createElement( 'div' )
  );

  React.useEffect( () => {
    canvasAnchor.current.appendChild( store.game.view );
  } );

  return (
    <div className='game-view'>
      <div
        ref={ canvasAnchor }
        className={ 'game-canvas' }
      />
    </div>
  );
}

export default GameView;
