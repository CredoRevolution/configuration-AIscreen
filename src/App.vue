<template>
  <div id="app">
    <h1 class="main-screen__title">Configuration creation</h1>
    <Network />
  </div>
</template>

<script>
import Network from '@/components/Network.vue'
export default {
  name: 'App',
  components: { Network },
}
</script>

<style lang="scss">
@function rem($px) {
  @return ($px / 16px) + rem;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'satoshi', sans-serif;
}
body {
  overflow-y: scroll;
}
#app {
  background: rgba(245, 245, 248, 1);
  padding: 10vh 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.main-screen__title {
  font-size: rem(40px);
  line-height: rem(48px);
  font-weight: 700;
  color: #14121f;
  margin-bottom: rem(31px);
}
</style>
