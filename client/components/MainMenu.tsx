import React, { Dispatch, SetStateAction } from 'react';

import Auth from '../Auth';
import { IPawnData } from '../game/Pawn';
import Store from '../Store';
import ClassSelect from './ClassSelect';

interface IProps {
  auth: Auth;
  store: Store;
  isAuthenticated: boolean;
  userData: IPawnData;
  setUserData: Dispatch<IPawnData>;
  toggleGameIsActive (): void;
}

function MainMenu ( props: IProps ): JSX.Element {
  const username: string = props.userData.name;
  const userClass: string = props.userData.type;

  return (
    <div className='main-menu'>
      <div className='menu-title'>Eden</div>
      {
        ( props.isAuthenticated && username.length )
          ? `Logged in as ${ username }`
          : <button
            disabled={ props.isAuthenticated }
            onClick={ props.auth.login }
          >
            Sign in
          </button>
      }
      <button
        disabled={ !userClass.length }
        onClick={ props.toggleGameIsActive }
      >
        {
          ( userClass.length )
            ? 'Enter Game'
            : 'Select a class...'
        }
      </button>
      <ClassSelect
        store={ props.store }
        userData={ props.userData }
      />
    </div>
  );
}

export default MainMenu;
