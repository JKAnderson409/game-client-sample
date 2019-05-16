import GameServer from './GameServer';

( function init (): void {
  const gameServer: GameServer = new GameServer();

  if ( !gameServer ) {
    console.error( 'Server startup failed.' );
  }
} )();
