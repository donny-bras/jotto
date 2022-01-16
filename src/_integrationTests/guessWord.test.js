import { mount } from "enzyme";
import { findByTestAttr } from "../../test/testUtils";
import { SuccessProvider } from "../contexts/SuccessContext";
import { GuessedWordsProvider } from "../contexts/GuessedWordsContext";
import Congrats from "../components/Congrats";
import GuessedWords from "../components/GuessedWords";
import Input from "../components/Input";

/**
 * Functional tests for App components
 */

/**
 * Creates wrapper with specified conditions,
 * then submits a guessed word of 'train'
 * @param {object} state - Initial State
 * @returns {Wrapper} - Enzyme wrapper of mounted App component
 */
const setup = ({ secretWord, guessedWords }) => {
  const wrapper = mount(
    <SuccessProvider>
      <GuessedWordsProvider>
        <Congrats />
        <Input secretWord={secretWord} />
        <GuessedWords />
      </GuessedWordsProvider>
    </SuccessProvider>
  );

  const input = findByTestAttr(wrapper, "input");
  input.simulate("change", { target: { value: "train" } });

  const submitBtn = findByTestAttr(wrapper, "submit-btn");
  submitBtn.simulate("click", { preventDefault: () => {} });

  guessedWords.forEach((guess) => {
    input.simulate("change", { target: { value: guess.guessedWord } });
    submitBtn.simulate("click", { preventDefault: () => {} });
  });

  return wrapper;
};

describe("guess a word", () => {
  describe("no words guessed", () => {
    let wrapper;

    beforeEach(() => {
      wrapper = setup({
        secretWord: "party",
        guessedWords: [],
      });
    });

    test("should create GuessedWords table with one row", () => {
      const guessedWordsRows = findByTestAttr(wrapper, "guessed-word");
      expect(guessedWordsRows).toHaveLength(1);
    });
  });

  describe("some words guessed", () => {
    let wrapper;

    beforeEach(() => {
      wrapper = setup({
        secretWord: "party",
        guessedWords: [{ guessedWord: "agile", letterMatchCount: 1 }],
      });
    });

    test("should create GuessedWords table with one row", () => {
      const guessedWordsRows = findByTestAttr(wrapper, "guessed-word");
      expect(guessedWordsRows).toHaveLength(2);
    });
  });

  describe("guess secret word", () => {
    let wrapper;

    beforeEach(() => {
      wrapper = setup({
        secretWord: "party",
        guessedWords: [{ guessedWord: "agile", letterMatchCount: 1 }],
      });

      const input = findByTestAttr(wrapper, "input");
      input.simulate("change", { target: { value: "party" } });

      const submitBtn = findByTestAttr(wrapper, "submit-btn");
      submitBtn.simulate("click", { preventDefault: () => {} });
    });

    test("should add row to guessedWord table", () => {
      const guessedWordsRows = findByTestAttr(wrapper, "guessed-word");
      expect(guessedWordsRows).toHaveLength(3);
    });

    test("should show congrats message", () => {
      const congratsMessage = findByTestAttr(wrapper, "congrats-message");
      expect(congratsMessage).toHaveLength(1);
    });

    test("should not show input component content", () => {
      const input = findByTestAttr(wrapper, "input");
      expect(input).toHaveLength(0);

      const submitBtn = findByTestAttr(wrapper, "input");
      expect(submitBtn).toHaveLength(0);
    });
  });
});