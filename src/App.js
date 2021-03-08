import { useEffect, useRef, useState } from 'react';
import './App.scss';

function useEventListener(eventName, handler, element = window){
  const savedHandler = useRef();

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
      const isSupported = element && element.addEventListener;
      if (!isSupported) return;
      const eventListener = event => savedHandler.current(event);
      element.addEventListener(eventName, eventListener);
      return () => {
        element.removeEventListener(eventName, eventListener);
      };
    },
    [eventName, element] // Re-run if eventName or element changes
  );
};

function App() {

  const tilesDefault = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];

  const [tiles, setTiles] = useState([...tilesDefault]);

  useEffect(() => {
    newGame();
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    }
  });

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowUp':
        moveUp();
        return;
      case 'ArrowRight':
        moveRight();
        return;
      case 'ArrowDown':
        moveDown();
        return;
      case 'ArrowLeft':
        moveLeft();
        return;
      default:
        return;
    }
  };

  const newGame = () => {
    setTiles(tilesDefault);
    randomTile(tilesDefault);
    randomTile(tilesDefault);
  };

  const randomTile = (listTiles = tiles) => {
    const tilesEmpty = getTilesEmpty();
    const newNumber = Math.random() > 0.9 && tilesEmpty.length !== 16 ? 4 : 2;
    const newTile = tilesEmpty[Math.floor(Math.random() * tilesEmpty.length)];
    let newTiles = [...listTiles];
    newTiles[newTile.row][newTile.tile] = newNumber;
    setTiles(newTiles);
  };

  const getTilesEmpty = () => {
    const tilesEmpty = [];
    tiles?.map((row, indexRow) => {
      row?.map((tile, indexTile) => {
        if (tile === 0) {
          tilesEmpty.push({ row: indexRow, tile: indexTile });
        }
        return null;
      });
      return null;
    });
    return tilesEmpty;
  };

  const merge = (arr, reverse = false) => {
    let newArr = arr.filter(item => item !== 0);
    let preTile = -1;
    if (reverse) {
      newArr = newArr.reverse();
    }
    newArr.map((row, index) => {
      if (preTile >= 0 && newArr[preTile] === row) {
        newArr[preTile] *= 2;
        newArr[index] = 0;
        preTile = -1;
        return null;
      }
      preTile = index;
      return null;
    });

    newArr = newArr.filter(item => item !== 0);
    newArr[0] = newArr[0] ? newArr[0] : 0;
    newArr[1] = newArr[1] ? newArr[1] : 0;
    newArr[2] = newArr[2] ? newArr[2] : 0;
    newArr[3] = newArr[3] ? newArr[3] : 0;

    if (reverse) {
      newArr = newArr.reverse();
    }

    return newArr;
  };

  const moveUp = () => {
    let newTiles = [...tiles];
    
    let col0 = merge([newTiles[0][0], newTiles[1][0], newTiles[2][0], newTiles[3][0]]);
    let col1 = merge([newTiles[0][1], newTiles[1][1], newTiles[2][1], newTiles[3][1]]);
    let col2 = merge([newTiles[0][2], newTiles[1][2], newTiles[2][2], newTiles[3][2]]);
    let col3 = merge([newTiles[0][3], newTiles[1][3], newTiles[2][3], newTiles[3][3]]);

    newTiles[0] = [col0[0], col1[0], col2[0], col3[0]];
    newTiles[1] = [col0[1], col1[1], col2[1], col3[1]];
    newTiles[2] = [col0[2], col1[2], col2[2], col3[2]];
    newTiles[3] = [col0[3], col1[3], col2[3], col3[3]];

    setTiles(newTiles);
    randomTile(newTiles);
  };

  const moveRight = () => {
    let newTiles = [...tiles];

    newTiles[0] = merge([newTiles[0][0], newTiles[0][1], newTiles[0][2], newTiles[0][3]], true);
    newTiles[1] = merge([newTiles[1][0], newTiles[1][1], newTiles[1][2], newTiles[1][3]], true);
    newTiles[2] = merge([newTiles[2][0], newTiles[2][1], newTiles[2][2], newTiles[2][3]], true);
    newTiles[3] = merge([newTiles[3][0], newTiles[3][1], newTiles[3][2], newTiles[3][3]], true);

    setTiles(newTiles);
    randomTile(newTiles);
  };

  const moveDown = () => {
    let newTiles = [...tiles];

    let col0 = merge([newTiles[0][0], newTiles[1][0], newTiles[2][0], newTiles[3][0]], true);
    let col1 = merge([newTiles[0][1], newTiles[1][1], newTiles[2][1], newTiles[3][1]], true);
    let col2 = merge([newTiles[0][2], newTiles[1][2], newTiles[2][2], newTiles[3][2]], true);
    let col3 = merge([newTiles[0][3], newTiles[1][3], newTiles[2][3], newTiles[3][3]], true);

    newTiles[0] = [col0[0], col1[0], col2[0], col3[0]];
    newTiles[1] = [col0[1], col1[1], col2[1], col3[1]];
    newTiles[2] = [col0[2], col1[2], col2[2], col3[2]];
    newTiles[3] = [col0[3], col1[3], col2[3], col3[3]];

    setTiles(newTiles);
    randomTile(newTiles);
  };

  const moveLeft = () => {
    let newTiles = [...tiles];

    newTiles[0] = merge([newTiles[0][0], newTiles[0][1], newTiles[0][2], newTiles[0][3]]);
    newTiles[1] = merge([newTiles[1][0], newTiles[1][1], newTiles[1][2], newTiles[1][3]]);
    newTiles[2] = merge([newTiles[2][0], newTiles[2][1], newTiles[2][2], newTiles[2][3]]);
    newTiles[3] = merge([newTiles[3][0], newTiles[3][1], newTiles[3][2], newTiles[3][3]]);

    setTiles(newTiles);
    randomTile(newTiles);
  };

  return (
    <div className="app">
      <div className="btn-container">
        <div className="btn" onClick={() => newGame()}>New Game</div>
      </div>
      <div className="tile-container">
        {/* Row 0 */}
        <div id="position-00" className={`tile ${tiles[0][0] ? 'tile-' + tiles[0][0] : ''}`}>{tiles[0][0] ? tiles[0][0] : ''}</div>
        <div id="position-01" className={`tile ${tiles[0][1] ? 'tile-' + tiles[0][1] : ''}`}>{tiles[0][1] ? tiles[0][1] : ''}</div>
        <div id="position-02" className={`tile ${tiles[0][2] ? 'tile-' + tiles[0][2] : ''}`}>{tiles[0][2] ? tiles[0][2] : ''}</div>
        <div id="position-03" className={`tile ${tiles[0][3] ? 'tile-' + tiles[0][3] : ''}`}>{tiles[0][3] ? tiles[0][3] : ''}</div>
        {/* Row 1 */}
        <div id="position-10" className={`tile ${tiles[1][0] ? 'tile-' + tiles[1][0] : ''}`}>{tiles[1][0] ? tiles[1][0] : ''}</div>
        <div id="position-11" className={`tile ${tiles[1][1] ? 'tile-' + tiles[1][1] : ''}`}>{tiles[1][1] ? tiles[1][1] : ''}</div>
        <div id="position-12" className={`tile ${tiles[1][2] ? 'tile-' + tiles[1][2] : ''}`}>{tiles[1][2] ? tiles[1][2] : ''}</div>
        <div id="position-13" className={`tile ${tiles[1][3] ? 'tile-' + tiles[1][3] : ''}`}>{tiles[1][3] ? tiles[1][3] : ''}</div>
        {/* Row 2 */}
        <div id="position-20" className={`tile ${tiles[2][0] ? 'tile-' + tiles[2][0] : ''}`}>{tiles[2][0] ? tiles[2][0] : ''}</div>
        <div id="position-21" className={`tile ${tiles[2][1] ? 'tile-' + tiles[2][1] : ''}`}>{tiles[2][1] ? tiles[2][1] : ''}</div>
        <div id="position-22" className={`tile ${tiles[2][2] ? 'tile-' + tiles[2][2] : ''}`}>{tiles[2][2] ? tiles[2][2] : ''}</div>
        <div id="position-23" className={`tile ${tiles[2][3] ? 'tile-' + tiles[2][3] : ''}`}>{tiles[2][3] ? tiles[2][3] : ''}</div>
        {/* Row 3 */}
        <div id="position-30" className={`tile ${tiles[3][0] ? 'tile-' + tiles[3][0] : ''}`}>{tiles[3][0] ? tiles[3][0] : ''}</div>
        <div id="position-31" className={`tile ${tiles[3][1] ? 'tile-' + tiles[3][1] : ''}`}>{tiles[3][1] ? tiles[3][1] : ''}</div>
        <div id="position-32" className={`tile ${tiles[3][2] ? 'tile-' + tiles[3][2] : ''}`}>{tiles[3][2] ? tiles[3][2] : ''}</div>
        <div id="position-33" className={`tile ${tiles[3][3] ? 'tile-' + tiles[3][3] : ''}`}>{tiles[3][3] ? tiles[3][3] : ''}</div>
      </div>
    </div>
  );
}

export default App;
