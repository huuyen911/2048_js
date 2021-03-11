import { useEffect, useRef, useState } from 'react';
import './App.scss';

function App() {
  const tilesDefault = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];

  const [tiles, setTiles] = useState([...tilesDefault]);
  const [score, setScore] = useState(0);
  const winRef = useRef();
  const loseRef = useRef();

  useEffect(() => {
    newGame();
  }, []);

  useEffect(() => {
    handleLose(tiles);
  }, [tiles]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    }
  });

  const handleKeyDown = (e) => {
    if (winRef.current.classList.contains('end-game') || loseRef.current.classList.contains('end-game')) {
      return;
    }
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

  const handleLose = (listTiles) => {
    let status = true;
    let preTile = 0;

    const col0 = [listTiles[0][0], listTiles[1][0], listTiles[2][0], listTiles[3][0]];
    const col1 = [listTiles[0][1], listTiles[1][1], listTiles[2][1], listTiles[3][1]];
    const col2 = [listTiles[0][2], listTiles[1][2], listTiles[2][2], listTiles[3][2]];
    const col3 = [listTiles[0][3], listTiles[1][3], listTiles[2][3], listTiles[3][3]];

    const cols = [col0, col1, col2, col3];

    cols.map(col => {
      preTile = 0;
      col.map(tile => {
        if ((tile === preTile && tile !== 0) || tile === 0) {
          status = false;
        } else {
          preTile = tile;
        }
        return null;
      });
      return null;
    });

    listTiles.map(row => {
      preTile = 0;
      row.map(tile => {
        if ((tile === preTile && tile !== 0) || tile === 0) {
          status = false;
        } else {
          preTile = tile;
        }
        return null;
      });
      return null;
    });

    if (status) {
      loseRef.current.classList.add('end-game');
    }
  }

  const handleWin = (listTiles) => {
    listTiles.map(row => {
      row.map(tile => {
        if (tile === 2048) {
          winRef.current.classList.add('end-game');
        }
        return null;
      });
      return null;
    });
  }

  const newGame = () => {
    winRef.current.classList.remove('end-game');
    loseRef.current.classList.remove('end-game');
    randomTile(tilesDefault);
    randomTile(tilesDefault);
  };

  const randomTile = (listTiles = tiles) => {
    if (winRef.current.classList.contains('end-game') || loseRef.current.classList.contains('end-game')) {
      return;
    }
    const tilesEmpty = getTilesEmpty(listTiles);
    const newNumber = Math.random() > 0.95 && tilesEmpty.length !== 16 ? 4 : 2;
    const newTile = tilesEmpty[Math.floor(Math.random() * tilesEmpty.length)];
    let newTiles = [...listTiles];
    if (newTile) {
      newTiles[newTile.row][newTile.tile] = newNumber;
      setTiles(newTiles);
    } else {
      setTiles(listTiles);
    }
  };

  const getTilesEmpty = (listTiles) => {
    const tilesEmpty = [];
    listTiles?.map((row, indexRow) => {
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
    let _newArr = [];
    let canMerged = true;

    if (reverse) {
      newArr = newArr.reverse();
    }

    newArr.map((tile, index) => {
      if (canMerged && (index + 1 <= newArr.length - 1) && (newArr[index] === newArr[index + 1] || newArr[index] === 0 || newArr[index + 1] === 0)) {
        if (newArr[index] > 0 && newArr[index + 1] > 0) {
          setScore(score + newArr[index] + newArr[index + 1]);
        }
        _newArr[index] = newArr[index] + newArr[index + 1];
        newArr[index + 1] = 0;
        canMerged = false;
      } else {
        _newArr[index] = newArr[index];
        canMerged = true;
      }
      return null;
    });

    newArr = _newArr.filter(item => item !== 0);
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

    handleWin(newTiles);
    randomTile(newTiles);
  };

  const moveRight = () => {
    let newTiles = [...tiles];

    newTiles[0] = merge([newTiles[0][0], newTiles[0][1], newTiles[0][2], newTiles[0][3]], true);
    newTiles[1] = merge([newTiles[1][0], newTiles[1][1], newTiles[1][2], newTiles[1][3]], true);
    newTiles[2] = merge([newTiles[2][0], newTiles[2][1], newTiles[2][2], newTiles[2][3]], true);
    newTiles[3] = merge([newTiles[3][0], newTiles[3][1], newTiles[3][2], newTiles[3][3]], true);

    handleWin(newTiles);
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

    handleWin(newTiles);
    randomTile(newTiles);
  };

  const moveLeft = () => {
    let newTiles = [...tiles];

    newTiles[0] = merge([newTiles[0][0], newTiles[0][1], newTiles[0][2], newTiles[0][3]]);
    newTiles[1] = merge([newTiles[1][0], newTiles[1][1], newTiles[1][2], newTiles[1][3]]);
    newTiles[2] = merge([newTiles[2][0], newTiles[2][1], newTiles[2][2], newTiles[2][3]]);
    newTiles[3] = merge([newTiles[3][0], newTiles[3][1], newTiles[3][2], newTiles[3][3]]);

    handleWin(newTiles);
    randomTile(newTiles);
  };

  return (
    <div className="app">
      <div className="name">
        <div className="name-game">2048</div>
        <div className="score">
          <div>Score</div>
          <div>{score}</div>
        </div>
      </div>
      <div className="header">
        <div className="author">Created by <strong><u>Nguyen Huu Yen</u></strong>.</div>
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
        <div className="win" ref={winRef}>Win !!</div>
        <div className="lose" ref={loseRef}>Lose :((</div>
      </div>
      <div className="description">
        <strong>HOW TO PLAY:</strong> Use your <strong>arrow keys</strong> to move the tiles. Tiles with the same number <strong>merge into one</strong> when they touch. Add them up to reach <strong>2048!</strong>
      </div>
    </div>
  );
}

export default App;
