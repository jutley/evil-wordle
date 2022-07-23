const { defineConfig } = require('@vue/cli-service')
process.env.NODE_ENV === "production" ? "/evil-wordle/" : "/",
module.exports = defineConfig({
  transpileDependencies: true
})
