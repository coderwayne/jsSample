<template>
  <div id="app">
    <el-button @click="addNewMsg('老胡啊')">添加新消息</el-button>
    <MessageBoard ref="messageBoard"></MessageBoard>
  </div>
</template>

<script>

import MessageBoard from "./components/MessageBoard";

export default {
  name: 'App',
  components: {
    MessageBoard
  },
  methods:{
    addNewMsg(info) {
      console.log("just test");
      this.$refs.messageBoard.appendText(info);
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
  color: #2c3e50;
  margin-top: 60px;
}
</style>
