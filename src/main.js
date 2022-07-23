import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

function generatePattern(guess, answer) {
  const pattern = ['gray', 'gray', 'gray', 'gray', 'gray']
  const answerCopy = answer.split('')
  for (var i = 0; i < guess.length; i++) {
    if (guess.charAt(i) == answerCopy[i]) {
      pattern[i] = 'green'
      answerCopy[i] = null
    }
  }
  for (i = 0; i < guess.length; i++) {
    if (pattern[i] != 'green') {
      const index = answerCopy.indexOf(guess.charAt(i))
      if (index != -1) {
        pattern[i] = 'yellow'
        answerCopy[index] = null
      }
    }
  }
  return pattern
}

function findLeastHelpfulPattern(guess, wordBank) {
  const patterns = {}
  for (const word of wordBank) {
    const pattern = generatePattern(guess, word)
    if (!(pattern in patterns)) {
      patterns[pattern] = []
    }
    patterns[pattern].push(word)
  }
  var max = 0, pattern, newWordBank
  const allGreen = ['green', 'green', 'green', 'green', 'green']
  for (const [curPattern, curWordBank] of Object.entries(patterns)) {
    console.log(curPattern, curWordBank.length)
    console.log(allGreen.join(','), curPattern === allGreen.join(','))
    if (curWordBank.length > max && curPattern !== allGreen.join(',')) {

      console.log("chosen")
      max = curWordBank.length
      pattern = curPattern
      newWordBank = curWordBank
    }
  }
  if (pattern) {
    return [pattern.split(','), newWordBank]
  } else {
    return [allGreen, patterns[allGreen.join(',')]]
  }
}

const store = createStore({
  state: {
    gameName: "Evil Wordle",
    wordLength: 5,
    totalGuessCount: 6,
    guesses: [],
    letters: [],
    letterColors: {},
    keyboardRows: [
      ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
      ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
      ['⇐', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '↪']
    ],
    allWords: null,
    remainingWords: null
  },
  mutations: {
    populateAllWords (state, words) {
      state.allWords = words
      state.remainingWords = words
    },
    enterLetter (state, letter) {
      if (state.letters.length < state.wordLength) {
        state.letters.push(letter)
      }
    },
    deleteLetter (state) {
      if (state.letters.length > 0) {
        state.letters.pop()
      }
    },
    enterGuess (state) {
      const word = state.letters.join('')
      if (word.length == state.wordLength && state.allWords.includes(word)) {
        const [pattern, newWordBank] = findLeastHelpfulPattern(word, state.remainingWords)
        for (var i = 0; i < state.wordLength; i++) {
          if (!(state.letters[i] in state.letterColors)){
            state.letterColors[state.letters[i]] = pattern[i]
          } else if (state.letterColors[state.letters[i]] == 'yellow' && pattern[i] == 'green') {
            state.letterColors[state.letters[i]] = 'green'
          }
        }
        const guess = {
          word: word,
          pattern: pattern
        }
        state.guesses.push(guess)
        state.letters = []
        state.remainingWords = newWordBank
        console.log(pattern, state.remainingWords.length, state.remainingWords)
      }
    }
  },
  actions: {
    fetchWords ({ commit }) {
      axios
        .get('words.txt')
        .then(response => response.data)
        .then(wordsRaw => wordsRaw.split("\n"))
        .then(words => commit('populateAllWords', words))

    }
  }
})
const app = createApp(App)
app.use(store)
app.use(VueAxios, axios)
app.mount('#app')
