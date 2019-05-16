import * as express from 'express';
import * as http from 'http';
import WebSocket, { Server } from 'ws';

import { IPawnData } from '../client/game/Pawn';
import Message from './Message';

class GameServer {
  readonly port: number = 4040;

  private app: Express.Application = express();
  private http: http.Server = http.createServer( this.app );
  private webSocketServer: Server = new Server( { server: this.http } );
  private webSockets: Set<WebSocket> = new Set( [] );

  private worldUserData: Set<IPawnData> = new Set( [] );

  constructor () {
    this.handleWebSocketServer();
    this.http.listen( this.port, () => {
      console.info( `\nServer is listening on port ${ this.port }` );
    } );
  }

  private handleWebSocketServer (): void {
    this.webSocketServer
      .on( 'connection', ( ws: WebSocket ) => {
        this.webSockets.add( ws );

        console.info( `
          Connection opened at ${ new Date().toLocaleString() }
          Client count: ${ this.webSocketServer.clients.size }
        ` );

        const worldUserDataMsg: Message = new Message( this.worldUserData );

        this.updateClients( worldUserDataMsg );

        ws.on( 'message', ( msg: string ) => {
          const { category, content }: Message = JSON.parse( msg );
          console.info( `Received ${ category } message.` );

          switch ( category ) {
            case 'userData':
              this.addUserData( content[ 0 ] );
          }

        } );
      } );
  }

  private updateClients ( message: Message ): void {
    this.webSockets.forEach( ( ws: WebSocket ) => {
      ws.send( JSON.stringify( message ) );
    } );
  }

  private addUserData ( data: IPawnData ): void {
    this.worldUserData.add( data );
  }
}

export default GameServer;
