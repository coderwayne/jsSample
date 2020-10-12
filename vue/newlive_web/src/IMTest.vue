<template>
  <div id="myBox">
    <h2 style="text-align: center">这是IM测试页!!!</h2>
    <MessageBoard ref="messageBoard" style="margin: 10px"></MessageBoard>
    <div class="leftBtnBox">
      <el-input v-model="userName" placeholder="user name"></el-input>
      <el-button @click="generateUserSig()">请求userSig</el-button>
      <el-button @click="addNewMsg('老胡啊!!')">添加新消息</el-button>
    </div>
  </div>
</template>

<script>
import MessageBoard from "./components/MessageBoard";
import TIM from "tim-js-sdk";
import COS from "cos-js-sdk-v5";

let options = {
  SDKAppID: 1400406104, // 接入时需要将0替换为您的即时通信 IM 应用的 SDKAppID
};
// 创建 SDK 实例，`TIM.create()`方法对于同一个 `SDKAppID` 只会返回同一份实例
let tim = TIM.create(options); // SDK 实例通常用 tim 表示

// 设置 SDK 日志输出级别，详细分级请参见 setLogLevel 接口的说明
tim.setLogLevel(0); // 普通级别，日志量较多，接入时建议使用
// tim.setLogLevel(1); // release 级别，SDK 输出关键信息，生产环境时建议使用

// 注册 COS SDK 插件
tim.registerPlugin({ "cos-js-sdk": COS });

export default {
  name: "IMTest",
  data() {
    return {
      userName: "jack",
    };
  },
  components: {
    MessageBoard,
  },
  methods: {
    addNewMsg(info) {
      console.log("just test");
      this.$refs.messageBoard.appendText(info);
    },
    // step 1 : 根据用户名生成userSig
    generateUserSig() {
      var userSig = this.genTestUserSig("jack").userSig;
      this.$refs.messageBoard.appendText("生成sig成功："+userSig);
    },

    genTestUserSig(userID) {
      var SDKAPPID = 1400406104;
      var EXPIRETIME = 604800;
      var SECRETKEY = "632fd231b0d45d028f56089598c8cf9adb573317bb1c63510067abf02555c353";

      var generator = new window.LibGenerateTestUserSig(
        SDKAPPID,
        SECRETKEY,
        EXPIRETIME
      );
      var userSig = generator.genTestUserSig(userID);
      return {
        SDKAppID: SDKAPPID,
        userSig: userSig,
      };
    }
  },
};
</script>

<style>
#myBox {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  background-color: bisque;
  color: #2c3e50;
}

#myBox .leftBtnBox button,
input {
  margin: 10px;
}
</style>