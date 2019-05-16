import Message from '../server/Message';
import Store from './Store';

class Socket {
  private store: Store;
  private webSocket: WebSocket = new WebSocket( 'ws://localhost:4040' );

  constructor ( store: Store ) {
    this.store = store;
    this.webSocket.onopen = this.onOpen;
    this.webSocket.onmessage = this.onMessage;
    this.webSocket.onerror = this.onError;
  }

  getIsConnected = (): boolean => {
    return this.webSocket.readyState === WebSocket.OPEN;
  }

  private onOpen = (): void => {
    console.info( 'Connection opened' );

    const userDataMsg: Message = new Message( [ this.store.userData() ] );

    this.webSocket.send( JSON.stringify( userDataMsg ) );
  }

  private onMessage = ( msgEvent: MessageEvent ): void => {
    console.log( JSON.parse( msgEvent.data ) );
  }

  private onError = (): void => {
    console.error( `WebSocket connection failed.` );
  }
}

export default Socket;
