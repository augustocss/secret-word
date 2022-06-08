// css
import './App.css';

// react
import { useCallback, useEffect, useState } from 'react';

// dados
import { wordsList } from './data/words';

// components
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages = [
    { id: 1, name: 'start' },
    { id: 2, name: 'game' },
    { id: 3, name: 'end' }
];

const guessesQty = 3;

function App() {
    const [gameStage, setGameStage] = useState(stages[0].name);
    const [words] = useState(wordsList);

    const [pickedWord, setPickedWord] = useState("");
    const [pickedCategory, setPickedCategory] = useState("");
    const [letters, setLetters] = useState([]);

    const [guessedLetters, setGuessedLetters] = useState([]);
    const [wrongLetters, setWrongLetters] = useState([]);
    const [guesses, setGuesses] = useState(guessesQty);
    const [score, setScore] = useState(0);

    // pick word and category
    const pickWordAndCategory = useCallback(() => {
        // pick a random category
        const categories = Object.keys(words);
        const category = categories[Math.floor(Math.random() * Object.keys(categories).length)];
        
        // pick a random word
        const word = words[category][Math.floor(Math.random() * words[category].length)];
        
        return { word, category };
    }, [words]);

    // starts the secret word game
    const startGame = useCallback(() => {
        // clear all letters
        clearLetterStates();

        // pick word and category
        const { word, category } = pickWordAndCategory();
        
        // create an array of letters and normalize to lowercase
        let wordLetters = word.toLowerCase().split("");

        // fill states
        setPickedWord(word);
        setPickedCategory(category);
        setLetters(wordLetters);

        console.log(wordLetters);

        setGameStage(stages[1].name);
    }, [pickWordAndCategory]);
    // process the letter input
    const verifyLetter = (letter) => {
        const normalizedLetter = letter.toLowerCase();

        // check if letter has already been utilized
        if(guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)){
            return;
        }

        // push guessed letters or remove a guess
        if(letters.includes(normalizedLetter)) {
            setGuessedLetters((actualGuessedLetters) => [
                ...actualGuessedLetters, normalizedLetter
            ])
        } else {
            setWrongLetters((actualWrongLetters) => [
                ...actualWrongLetters, normalizedLetter
            ])
            setGuesses((actualGuesses) => actualGuesses - 1);
        }              
    }

    const clearLetterStates = () => {
        setGuessedLetters([]);
        setWrongLetters([]);
    }
    
    // check if guesses ended
    useEffect(() => {
        if(guesses <= 0) {
            //reset all states
            clearLetterStates();

            setGameStage(stages[2].name);
        }
    }, [guesses])

    // check win condition
    useEffect(() => {
        // cria array com letras unicas a partir da palavra em jogo
        const uniqueLetter = [...new Set(letters)];

        // wind condition
        if(guessedLetters.length === uniqueLetter.length && gameStage === stages[1].name){
            // add score
            setScore((actualScore) => actualScore += 100)

            // restart game with new word
            startGame();
        }
    }, [guessedLetters, letters, startGame, gameStage])

    // restarts the game
    const retry = () => {
        setScore(0);
        setGuesses(guessesQty);

        setGameStage(stages[0].name);
    }

    return (
        <div className="App">
            {gameStage === 'start' && <StartScreen startGame={startGame} />}
            {gameStage === 'game' && <Game verifyLetter={verifyLetter} pickedWord={pickedWord} pickedCategory={pickedCategory} letters={letters} guessedLetters={guessedLetters} wrongLetters={wrongLetters} guesses={guesses} score={score} />}
            {gameStage === 'end' && <GameOver retry={retry} score={score} />}
        </div>
    );
}

export default App;
