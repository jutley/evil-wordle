<template>
  <div id="header">
    <h1>{{gameName}}</h1>

    <p>{{remainingWordsLength}} words remaining</p>
  </div>

  <div id="game">
    <div id="game-container" :class="{win: gameState == 'win', lose: gameState == 'lose'}">
      <div v-for="guess in guesses" :key="guess" class="guess">
        <div 
          v-for="(e, i) in guess.word.length" :key="i"
          class="letter" 
          :class="{
            green: guess.pattern[i] == 'green',
            yellow: guess.pattern[i] == 'yellow',
            gray: guess.pattern[i] == 'gray'
          }">{{ guess.word[i] }}</div>
      </div>

      <div v-if="guesses.length != totalGuessCount" class="guess">
        <div v-for="letter in letters" :key="letter" class="letter filled">{{ letter }}</div>
        <div v-for="i in wordLength - letters.length" :key="i" class="letter" :class="{active: i == 1}"></div>
      </div>

      <div v-for="i in futureGuessCount" :key="i" class="guess">
        <div v-for="j in wordLength" :key="j" class="letter future"></div>
      </div>
    </div>
  </div>

  <div id="toast-container">
    <div v-if="toastText != ''" id="toast">
      {{ toastText }}
    </div>
  </div>

  <div id="keyboard">
    <div v-for="(row, i) in keyboardRows" :key="row" class="row">
      <div v-if="i == keyboardRows.length - 1" class="key long" @click="deleteLetter()">
        del
      </div>
      <div
        v-for="key in row"
        :key="key"
        class="key"
        :class="{
          green: letterColors[key] == 'green',
          yellow: letterColors[key] == 'yellow',
          gray: letterColors[key] == 'gray',
        }"
        @click="enterLetter(key)"
      >
        {{key}}
      </div>
      <div v-if="i == keyboardRows.length - 1" class="key long" @click="enterGuess()">
        ent
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: 'App',
  mounted() {
    window.addEventListener('keydown', this.handleKeydown)
    this.$store.dispatch('fetchWords')
  },
  unmounted() {
    window.removeEventListener('keydown', this.handleKeydown)
  },
  computed: {
    gameName () {
      return this.$store.state.gameName
    },
    wordLength () {
      return this.$store.state.wordLength
    },
    totalGuessCount () {
      return this.$store.state.totalGuessCount
    },
    futureGuessCount () {
      return Math.max(
        0,
        this.$store.state.totalGuessCount - this.$store.state.guesses.length - 1
      )
    },
    letters () {
      return this.$store.state.letters
    },
    guesses () {
      return this.$store.state.guesses
    },
    keyboardRows () {
      return this.$store.state.keyboardRows
    },
    letterColors () {
      return this.$store.state.letterColors
    },
    remainingWordsLength () {
      if (this.$store.state.remainingWords) {
        return this.$store.state.remainingWords.length
      } else {
        return "..."
      }
    },
    wordSamples () {
      if (this.$store.state.remainingWords) {
        var shuffled = this.$store.state.remainingWords
          .map(value => ({ value, sort: Math.random() }))
          .sort((a, b) => a.sort - b.sort)
          .map(({ value }) => value)
        return shuffled.slice(0, 3)
      } else {
        return "..."
      }
    },
    gameState() {
      return this.$store.state.gameState
    },
    toastText() {
      if (this.$store.state.gameState == "win") {
        return "You win!"
      } else if (this.$store.state.gameState == "lose") {
        return "You lose!"
      } else return ""
    }
  },
  methods: {
    handleKeydown (event) {
      if (!(event.altKey || event.ctrlKey || event.metaKey || event.repeat) && this.$store.state.guesses.length < this.$store.state.totalGuessCount) {
        if (event.key >= 'a' && event.key <= 'z') {
          this.$store.commit('enterLetter', event.key)
        } else if (event.key == "Backspace") {
          this.$store.commit('deleteLetter')
        } else if (event.key == "Enter") {
          this.$store.commit('enterGuess')
        }
      }
    },
    enterLetter (letter) {
      this.$store.commit('enterLetter', letter)
    },
    deleteLetter () {
      this.$store.commit('deleteLetter')
    },
    enterGuess () {
      this.$store.commit('enterGuess')
    }
  }
}
</script>

<style>
html {
  height: 100%;
}

body{
  height: 100%;
  margin: 0;
  padding: 0;
  overflow-y: hidden;

  --background: #123;
  --gray-1: #234; 
  --gray-2: #345;
  --gray-3: #456;
  --yellow: #FD0;
  --green: #3D9;
  --red: #F44;

  background-color: var(--background);
  color: white;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  height: 100%;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  text-align: center;

  --letter-size: 50px;

  --key-height: 50px;
  --key-margin: 2px;
  --header-height: 100px;
  --keyboard-height: calc(3 * (var(--key-height) + var(--key-margin)));
}

#header {
  height: var(--header-height);
}

#header p {
  margin: 0;
}

#header h1 {
  margin: 0;
}

#game {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: center;
  align-items: center;
}

#game-container {
  padding: 5px;
  border: 1px solid var(--background);
}

#game-container.win {
  padding: 5px;
  border: 1px solid var(--green);
}

#game-container.lose {
  padding: 5px;
  border: 1px solid var(--red);
}

.guess {
  display: flex;
  justify-content: center;
}

.letter {
  display: block;
  width: var(--letter-size);
  height: var(--letter-size);
  line-height: var(--letter-size);
  margin: 5px;
  text-transform: uppercase;
  color: white;
  background-color: var(--gray-1);
  border-radius: 4px;
}

.active {
  background-color: var(--gray-2);
}

#toast-container {
  height: 2em;
  margin-bottom: 1em;
}

#toast {
  display: inline;
  padding: 0.5em 1em;
  background-color: var(--gray-1);
  border-radius: 4px;
}

#keyboard {
  display: flex;
  flex-flow: column;
  width: calc(100% - 8px);
  height: calc(var(--keyboard-height) - 8px);
  padding: 4px;
}

.row {
  display: flex;
  flex-flow: row;
  justify-content: center;
  height: calc(33.33%);
}

.key {
  display: flex;
  height: calc(100% - 2 * var(--key-margin));
  width: calc(10% - 2 * var(--key-margin));
  margin: var(--key-margin);
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  background-color: var(--gray-3);
  border-radius: 4px;
  cursor: pointer;
}

.key.long {
  width: calc(15% - 2 * var(--key-margin));
}

.green {
  background-color: var(--green);
  color: black;
}

.yellow {
  background-color: var(--yellow);
  color: black;
}

.letter.gray {
  background-color: var(--gray-3);
}

.key.gray {
  background-color: var(--gray-1);
}
</style>
