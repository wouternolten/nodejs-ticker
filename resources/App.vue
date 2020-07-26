<template>
  <div id="app">
    <TickerScreen />
  </div>
</template>

<script>
import TickerScreen from "./components/Ticker/TickerScreen.vue";

export default {
  name: "App",
  components: {
    TickerScreen,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
