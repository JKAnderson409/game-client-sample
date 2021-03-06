import {
  Auth0DecodedHash,
  Auth0Error,
  Auth0ParseHashError,
  Auth0UserProfile,
  WebAuth
} from 'auth0-js';
import { Dispatch } from 'react';

import auth0Config from '../../_KEYS';
import { IPawnData, IPawnDataUpdate } from './game/Pawn';
import Store from './Store';

class Auth {
  username: string;

  private store: Store;
  private auth0: WebAuth = new WebAuth( auth0Config );

  private accessToken: string | null;
  private idToken: string | null;
  private expiresAt: number | null;
  private clientID: string | null;

  constructor ( store: Store ) {
    this.store = store;
  }

  login = (): void => {
    this.auth0.authorize();
    this.handleAuthentication();
  }

  logout = (): void => {
    this.clientID = null;
    this.accessToken = null;
    this.idToken = null;
    this.expiresAt = null;
  }

  handleAuthentication = (): void => {
    this.auth0.parseHash(
      ( err: Auth0ParseHashError, authResult: Auth0DecodedHash ) => {
        if ( err ) {
          console.error( err );
          return;
        }
        this.setSession( authResult );
      }
    );
  }

  setSession = ( authResult: Auth0DecodedHash ): void => {
    if (
      !authResult ||
      !authResult.accessToken ||
      !authResult.idToken ||
      !authResult.expiresIn
    ) {
      return;
    }

    this.accessToken = authResult.accessToken;
    this.idToken = authResult.idToken;
    this.expiresAt = ( authResult.expiresIn * 1000 ) + new Date().getTime();

    this.auth0.client.userInfo(
      authResult.accessToken,
      ( err: Auth0Error, user: Auth0UserProfile ) => {
        if ( err ) {
          console.error( err );
        }

        this.store.updateUserData( {
          name: user.nickname
        } );
      }
    );
  }

  renewSession = async (): Promise<void> => {
    await this.auth0.checkSession(
      {},
      async ( err: Auth0Error, authResult: Auth0DecodedHash ) => {
        if ( err ) {
          return;
        }
        await this.setSession( authResult );
      }
    );
  }

  isAuthenticated = (): boolean => {
    if ( !this.expiresAt ) {
      return false;
    }
    return ( new Date().getTime() < this.expiresAt );
  }
}

export default Auth;
