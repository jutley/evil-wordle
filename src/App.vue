<template>
  <h1>{{gameName}}</h1>

  <p>{{remainingWordsLength}} words remaining</p>
  <p>{{wordSamples}}</p>

  <div id="game">
    <div v-for="guess in guesses" :key="guess" class="guess">
      <div 
        v-for="(e, i) in guess.word.length" :key="i"
        class="letter" 
        :class="{ green: guess.pattern[i] == 'green', yellow: guess.pattern[i] == 'yellow', gray: guess.pattern[i] == 'gray' }">{{ guess.word[i] }}</div>
    </div>

    <div v-if="guesses.length != totalGuessCount" class="guess">
      <div v-for="letter in letters" :key="letter" class="letter filled">{{ letter }}</div>
      <div v-for="i in wordLength - letters.length" :key="i" class="letter" :class="{active: i == 1}"></div>
    </div>

    <div v-for="i in futureGuessCount" :key="i" class="guess">
      <div v-for="j in wordLength" :key="j" class="letter future"></div>
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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin-top: 60px;
}

.guess {
  display: flex;
  justify-content: center;
}

.letter {
  display: block;
  width: 50px;
  height: 50px;
  line-height: 50px;
  border: 1px solid #666;
  margin: 5px;
  text-transform: capitalize;
}

.active {
  border-width: 2px;
  margin: 4px;
  border-color: #000;
}

.green {
  background-color: #7A7;
}

.yellow {
  background-color: #AA7;
}

.gray {
  background-color: #AAA;
}

#keyboard {
  display: flex;
  flex-flow: column;
}

.row {
  display: flex;
  flex-flow: row;
  justify-content: center;
}

.key {
  display: block;
  width: 30px;
  line-height: 40px;
  border: 1px solid;
  margin: 3px;
}

.key.long {
  width: 50px;
}

</style>
