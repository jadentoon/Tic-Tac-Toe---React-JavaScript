import React, { useRef, useState } from 'react'
import './TicTacToe.css'
import circle_icon from '../../assets/circle.png'
import cross_icon from '../../assets/cross.png'

let data = Array(9).fill("");

const TicTacToe = () => {

    let [count, setCount] = useState(0);
    let [lock, setLock] = useState(false);
    let [aiMode, setAiMode] = useState(false);
    let [difficulty, setDifficulty] = useState("Easy");
    let titleRef = useRef(null);
    let boxRefs = Array(9).fill().map(() => useRef(null));
    let ongoing = true;

    const toggle = (e, num) => {
        if (lock || data[num] !== "") {
            return;
        } 
        data[num] = count % 2 === 0 ? "x" : "o";
        e.target.innerHTML = `<img src='${data[num] === "x" ? cross_icon : circle_icon}' alt='' />`;
        setCount(++count);
        checkGameStatus();

        if (aiMode && ongoing){
            if (difficulty === "Easy") setTimeout(easyAiMove, 500);
            else if (difficulty === "Medium") setTimeout(mediumAiMove, 500);
            else setTimeout(hardAiMove, 500);
        }
    }

    const minimax = (board, depth, isMaximising) => {
        const scores = {x:-10, o:10, draw:0};
        let result = checkWin(data);
        if(result !== null) return scores[result];
        let bestScore = isMaximising ? -Infinity : Infinity;
        for (let i = 0; i < 9; i++){
            if (board[i] === ""){
                board[i] = isMaximising ? "o" : "x";
                let score = minimax(board, depth+1, !isMaximising);
                board[i] = "";
                bestScore = isMaximising ? Math.max(score, bestScore) : Math.min(score, bestScore);
            }
        }
        return bestScore;
    }

    const easyAiMove = () => {
        let emptyBoxes = data.map((value, index) => (value === ""?index:null)).filter(v => v !== null);
        if (emptyBoxes.length === 0) return;
        let randomMove = emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];
        data[randomMove] = "o";
        boxRefs[randomMove].current.innerHTML = `<img src='${circle_icon}' alt="" />`;
        setCount(++count);
        checkGameStatus();
    }

    const mediumAiMove = () => {
        if (Math.random() < 0.5){
            easyAiMove();
        } else {
            hardAiMove();
        }
    }

    const hardAiMove = () => {
        let bestScore = -Infinity;
        let move;
        for (let i = 0; i < 9; i++){
            if (data[i] === ""){
                data[i] = "o"
                let score = minimax(data, 0, false);
                data[i] = "";
                if (score > bestScore){
                    bestScore = score
                    move = i;
                }
            }
        }
        if (move !== undefined){
            data[move] =  "o";
            boxRefs[move].current.innerHTML = `<img src='${circle_icon}' alt="" />`;
            setCount(++count);
            checkGameStatus();
        }
    }

    const checkGameStatus = () => {
        let winner = checkWin(data);
        if (winner === "x" || winner === "o"){
            setLock(true);
            titleRef.current.innerHTML = `Congratulations: <img src=${winner==="x"?cross_icon:circle_icon}> Wins`;
            ongoing = false;
        } else if (data.every(box => box !== "")){
            setLock(true);
            titleRef.current.innerHTML = "Game Drawn - Click Reset to restart!";
            ongoing = false;
        }
    }

    const checkWin = (board) => {
        const winPatterns = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

        for (let pattern of winPatterns){
            const [a,b,c] = pattern;
            if (board[a] && board[a] === board[b] && board[a] === board[c]){
                return board[a];
            }
        }
        return board.includes("") ? null : "draw";
    }

    const reset = () => {
        setLock(false);
        data = ["", "", "", 
                "", "", "",
                "", "", ""];
        titleRef.current.innerHTML = 'Tic Tac Toe by <span>Jaden Toon</span>';
        boxRefs.forEach(ref => ref.current.innerHTML = "");
        setCount(0);
    }

    const changeDifficulty = () => {
        if (difficulty === "Easy") setDifficulty("Medium");
        else if (difficulty === "Medium") setDifficulty("Hard");
        else setDifficulty("Easy");
        reset();
    }

    return (
        <div className='container'>
        <h1 className='title' ref={titleRef}>Tic Tac Toe by <span>Jaden Toon</span></h1>
        <div className='modeButtons'>
            <button className='modeButton' onClick={() => {setAiMode(true); reset()}}>Play Against AI</button> 
            {aiMode?<button className='modeButton' onClick={changeDifficulty}>{difficulty}</button>:""}
            <button className='modeButton' onClick={() => {setAiMode(false); setDifficulty("Easy"); reset()}}>Two Player</button>
        </div>
        <h2 className='whoseTurn'>Turn: {count%2==0?<img src={cross_icon} /> : <img src={circle_icon} />}</h2>
        <div className="board">
            {[0, 1, 2].map(row => (
                <div className={`row ${row + 1}`} key = {row}>
                    {[0, 1, 2].map(col => {
                        let index = row*3 + col;
                        return <div className='boxes' ref={boxRefs[index]} key={index} onClick={(e) => toggle(e, index)}></div>
                    })}
                </div>
            ))}
        </div>
        <button className="reset" onClick={() => {reset()}}>Reset</button>
        </div>
    )
}

export default TicTacToe
