import { useEffect, useReducer } from "react";
import { getSecretWord } from "./actions/index";
import "./App.css";
import Congrats from "./components/Congrats";
import GuessedWords from "./components/GuessedWords";
import Input from "./components/Input";
import LanguagePicker from "./components/LanguagePicker";
import Spinner from "./components/Spinner";
import { GuessedWordsProvider } from "./contexts/GuessedWordsContext";
import LanguageContext from "./contexts/LanguageContext";
import { SuccessProvider } from "./contexts/SuccessContext";
import NewWordButton from "./components/NewWordButton";
import GiveUpMessage from "./components/GiveUpMessage";
import EnterSecretWordButton from "./components/EnterSecretWordButton";
import EnterSecretWordForm from "./components/EnterSecretWordForm";

const initialState = {
  language: "en",
  secretWord: null,
  giveUp: false,
  enterSecretWord: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_SECRET_WORD":
      return { ...state, secretWord: action.payload };
    case "SET_LANGUAGE":
      return { ...state, language: action.payload };
    case "SET_GIVE_UP":
      return { ...state, giveUp: action.payload };
    case "SET_ENTER_SECRET_WORD":
      return { ...state, enterSecretWord: action.payload };
    // case 'GUESS_WORD':
    //   const success = action.payload === state.secretWord;
    //   const guessedWord = {
    //     guessedWord: action.payload,
    //     letterMatchCount: getLetterMatchCount(action.payload, state.secretWord),
    //   };
    //   return {
    //     ...state,
    //     success,
    //     guessedWords: [...state.guessedWords, guessedWord],
    //   };
    default:
      throw new Error(`Invalid action type: ${action.type}`);
  }
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setSecretWord = (secretWord) => {
    dispatch({ type: "SET_SECRET_WORD", payload: secretWord });
    setEnterSecretWord(false);
  };

  const setLanguage = (language) => {
    dispatch({ type: "SET_LANGUAGE", payload: language });
  };

  const setGiveUp = (giveUp) => {
    dispatch({ type: "SET_GIVE_UP", payload: giveUp });
  };

  const setEnterSecretWord = (enterSecretWord) => {
    dispatch({ type: "SET_ENTER_SECRET_WORD", payload: enterSecretWord });
  };

  const resetGame = () => {
    setGiveUp(false);
    fetchSecretWord();
  };

  const fetchSecretWord = async () => {
    const secretWord = await getSecretWord(setSecretWord);
    // setSecretWord(secretWord);
  };

  useEffect(() => {
    fetchSecretWord();

    // alternatively
    // getSecretWord().then((secretWord) => setSecretWord(secretWord));
  }, []);

  if (!state.secretWord) {
    return <Spinner />;
  }

  return (
    <div data-test="component-app" className="container">
      <h1>Jotto</h1>
      <LanguageContext.Provider value={{ language: state.language }}>
        <LanguagePicker setLanguage={setLanguage} />
        <GuessedWordsProvider>
          {state.enterSecretWord ? (
            <EnterSecretWordForm
              onSubmit={setSecretWord}
              onCancel={() => setEnterSecretWord(false)}
            />
          ) : (
            <div>
              <SuccessProvider>
                {state.giveUp ? (
                  <GiveUpMessage secretWord={state.secretWord} />
                ) : (
                  <Congrats />
                )}
                <NewWordButton onClick={resetGame} />
                <Input secretWord={state.secretWord} onGiveUp={setGiveUp} />
              </SuccessProvider>
              <GuessedWords />
              <EnterSecretWordButton onClick={() => setEnterSecretWord(true)} />
            </div>
          )}
        </GuessedWordsProvider>
      </LanguageContext.Provider>
    </div>
  );
}

export default App;
