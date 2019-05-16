import React, { MutableRefObject } from 'react';

import Store from '../Store';

interface IProps {
  store: Store;
}

function GameView ( { store }: IProps ): JSX.Element {
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
