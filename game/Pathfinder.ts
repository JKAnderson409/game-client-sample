import Easystar from 'easystarjs';

import Store from '../Store';
import { Coords } from './GameMap';

class Pathfinder extends Easystar.js {
  private store: Store;
  private size: number;

  constructor ( store: Store, gridSize: number = 8 ) {
    super();
    this.store = store;
    this.size = gridSize;

    this.setAcceptableTiles( [ 0 ] );
  }

  getDistanceToPosition ( pos1: Coords, pos2: Coords ): number {
    return (
      Math.abs( pos1[ 0 ] - pos2[ 0 ] ) +
      Math.abs( pos1[ 1 ] - pos2[ 1 ] )
    );
  }

  getPathToPosition ( startCoords: Coords, targetCoords: Coords ): Promise<Coords[]> {
    return new Promise( ( resolve ) => {
      const pfGrid = this.getPawnPositionGrid();

      this.setGrid( pfGrid );
      this.findPath(
        startCoords[ 0 ],
        startCoords[ 1 ],
        targetCoords[ 0 ],
        targetCoords[ 1 ],
        ( path ) => {
          if ( !path ) {
            path = [];
          }
          const positionPath: Coords[] = path.map( ( { x, y } ): Coords => [ x, y ] );

          resolve( positionPath.slice( 1 ) );
        }
      );
      this.calculate();
    } );
  }

  getShortestPathToAdjacentPosition ( start: Coords, target: Coords ): Promise<Coords[]> {
    return new Promise( ( resolve, reject ) => {
      const adjacentPositions = this.getAdjacentSquares( target );

      const paths = adjacentPositions.map( ( coords ) => {
        return this.getPathToPosition( start, coords )
          .then( ( path ) => path );
      } );

      Promise.all( paths ).then( ( pathList ) => {
        pathList = pathList.filter( ( path ) => path.length > 0 );

        if ( !pathList.length ) {
          reject();
          return;
        }

        const shortestPath = pathList.reduce( ( acc, nextPath ) => {
          if ( nextPath.length === 0 ) {
            return acc;
          }

          return ( acc.length < nextPath.length ) ? acc : nextPath;
        } );
        resolve( shortestPath );
      } );
    } );
  }

  private getAdjacentSquares ( coords: Coords ): Coords[] {
    const squares: Coords[] = [
      [ coords[ 0 ] + 1, coords[ 1 ] ],
      [ coords[ 0 ] - 1, coords[ 1 ] ],
      [ coords[ 0 ], coords[ 1 ] + 1 ],
      [ coords[ 0 ], coords[ 1 ] - 1 ]
    ];

    return squares.filter( ( square ) => {
      return (
        ( square[ 0 ] >= 0 && square[ 0 ] <= 7 ) &&
        ( square[ 1 ] >= 0 && square[ 1 ] <= 7 )
      );
    } );
  }

  private getEmptyGrid (): number[][] {
    const grid = [];

    for ( let i = 0; i < this.size; i++ ) {
      const row = [];

      for ( let j = 0; j < this.size; j++ ) {
        row.push( 0 );
      }

      grid.push( row );
    }
    return grid;
  }

  private getMobPositions (): number[][] {
    const mobPositions: Coords[] = [];
    // const aiList = this.store.ai();

    // aiList.forEach( ( pawn ) => {
    //   mobPositions.push( pawn.data.state().boardPosition );
    // } );

    return mobPositions;
  }

  private getPawnPositionGrid (): number[][] {
    const grid = this.getEmptyGrid();
    const mobPositions: number[][] = this.getMobPositions();
    const playerPosition = this.store.userData().location;

    mobPositions.forEach( ( mobPosition ) => {
      const mobX = mobPosition[ 0 ];
      const mobY = mobPosition[ 1 ];
      grid[ mobY ][ mobX ] = 1;
    } );
    grid[ playerPosition[ 1 ] ][ playerPosition[ 0 ] ] = 1;

    return grid;
  }
}

export default Pathfinder;
