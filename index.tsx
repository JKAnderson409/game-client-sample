import * as React from 'react';
import { render } from 'react-dom';

import './assets/stylesheets/index.css';

import Auth from './Auth';
import App from './components/App';
import Store from './Store';

const root: HTMLDivElement = document.createElement( 'div' );
root.id = 'root';
document.body.appendChild( root );

( function init (): void {
  const store: Store = new Store();
  const auth: Auth = new Auth( store );

  render(
    <React.StrictMode>
      <App
        auth={ auth }
        store={ store }
      />
    </React.StrictMode>,
    root
  );
} )();
