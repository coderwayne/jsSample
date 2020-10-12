<template>
  <div id="myBox">
    <h2 style="text-align: center">这是IM测试页!!!</h2>
    <MessageBoard ref="messageBoard" style="margin: 10px"></MessageBoard>
    <div class="leftBtnBox">
      <el-input v-model="userName" placeholder="user name"></el-input>
      <el-button @click="generateUserSig()">请求userSig</el-button>
      <el-button @click="initTIMManager()">初始化TIMManager</el-button>
      <el-button @click="loginAction()">登录</el-button>
      <el-button @click="addNewMsg('老胡啊!!')">添加新消息</el-button>
    </div>
  </div>
</template>

<script>
import MessageBoard from "./components/MessageBoard";
import TIM from "tim-js-sdk";
import COS from "cos-js-sdk-v5";

export default {
  name: "IMTest",
  data() {
    return {
      userName: "jack",
      userSig: "",
      myTim: {},
    };
  },
  components: {
    MessageBoard,
  },
  methods: {
    addNewMsg(info) {
      this.$refs.messageBoard.appendText(info);
    },
    // step 1 : 根据用户名生成userSig
    generateUserSig() {
      this.userSig = this.genTestUserSig(this.userName).userSig;
      this.$refs.messageBoard.appendText("生成sig成功：" + this.userSig);
    },

    genTestUserSig(userID) {
      var SDKAPPID = 1400406104;
      var EXPIRETIME = 604800;
      var SECRETKEY =
        "632fd231b0d45d028f56089598c8cf9adb573317bb1c63510067abf02555c353";

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
    },
    // step 2 : 初始化TIMManager
    initTIMManager() {
      let options = {
        SDKAppID: 1400406104, // 接入时需要将0替换为您的即时通信 IM 应用的 SDKAppID
      };
      // 创建 SDK 实例，`TIM.create()`方法对于同一个 `SDKAppID` 只会返回同一份实例
      this.myTim = TIM.create(options); // SDK 实例通常用 tim 表示

      // 设置 SDK 日志输出级别，详细分级请参见 setLogLevel 接口的说明
      this.myTim.setLogLevel(0); // 普通级别，日志量较多，接入时建议使用
      // tim.setLogLevel(1); // release 级别，SDK 输出关键信息，生产环境时建议使用

      // 注册 COS SDK 插件
      this.myTim.registerPlugin({ "cos-js-sdk": COS });

      var that = this;

      // 监听事件，例如：
      this.myTim.on(TIM.EVENT.SDK_READY, function (event) {
        that.$refs.messageBoard.appendText("TIM.EVENT.SDK_READY");
        // 收到离线消息和会话列表同步完毕通知，接入侧可以调用 sendMessage 等需要鉴权的接口
        // event.name - TIM.EVENT.SDK_READY
      });

      this.myTim.on(TIM.EVENT.MESSAGE_RECEIVED, function (event) {
        that.$refs.messageBoard.appendText("TIM.EVENT.MESSAGE_RECEIVED");
        // 收到推送的单聊、群聊、群提示、群系统通知的新消息，可通过遍历 event.data 获取消息列表数据并渲染到页面
        // event.name - TIM.EVENT.MESSAGE_RECEIVED
        // event.data - 存储 Message 对象的数组 - [Message]
      });

      this.myTim.on(TIM.EVENT.MESSAGE_REVOKED, function (event) {
        that.$refs.messageBoard.appendText("TIM.EVENT.MESSAGE_REVOKED");
        // 收到消息被撤回的通知
        // event.name - TIM.EVENT.MESSAGE_REVOKED
        // event.data - 存储 Message 对象的数组 - [Message] - 每个 Message 对象的 isRevoked 属性值为 true
      });

      this.myTim.on(TIM.EVENT.MESSAGE_READ_BY_PEER, function (event) {
        that.$refs.messageBoard.appendText("TIM.EVENT.MESSAGE_READ_BY_PEER");
        // SDK 收到对端已读消息的通知，即已读回执。使用前需要将 SDK 版本升级至 v2.7.0 或以上。仅支持单聊会话。
        // event.name - TIM.EVENT.MESSAGE_READ_BY_PEER
        // event.data - event.data - 存储 Message 对象的数组 - [Message] - 每个 Message 对象的 isPeerRead 属性值为 true
      });

      this.myTim.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, function (event) {
        that.$refs.messageBoard.appendText(
          "TIM.EVENT.CONVERSATION_LIST_UPDATED"
        );
        // 收到会话列表更新通知，可通过遍历 event.data 获取会话列表数据并渲染到页面
        // event.name - TIM.EVENT.CONVERSATION_LIST_UPDATED
        // event.data - 存储 Conversation 对象的数组 - [Conversation]
      });

      this.myTim.on(TIM.EVENT.GROUP_LIST_UPDATED, function (event) {
        that.$refs.messageBoard.appendText("TIM.EVENT.GROUP_LIST_UPDATED");
        // 收到群组列表更新通知，可通过遍历 event.data 获取群组列表数据并渲染到页面
        // event.name - TIM.EVENT.GROUP_LIST_UPDATED
        // event.data - 存储 Group 对象的数组 - [Group]
      });

      this.myTim.on(TIM.EVENT.PROFILE_UPDATED, function (event) {
        that.$refs.messageBoard.appendText("TIM.EVENT.PROFILE_UPDATED");
        // 收到自己或好友的资料变更通知
        // event.name - TIM.EVENT.PROFILE_UPDATED
        // event.data - 存储 Profile 对象的数组 - [Profile]
      });

      this.myTim.on(TIM.EVENT.BLACKLIST_UPDATED, function (event) {
        that.$refs.messageBoard.appendText("TIM.EVENT.BLACKLIST_UPDATED");
        // 收到黑名单列表更新通知
        // event.name - TIM.EVENT.BLACKLIST_UPDATED
        // event.data - 存储 userID 的数组 - [userID]
      });

      this.myTim.on(TIM.EVENT.ERROR, function (event) {
        that.$refs.messageBoard.appendText("TIM.EVENT.ERROR");
        // 收到 SDK 发生错误通知，可以获取错误码和错误信息
        // event.name - TIM.EVENT.ERROR
        // event.data.code - 错误码
        // event.data.message - 错误信息
      });

      this.myTim.on(TIM.EVENT.SDK_NOT_READY, function (event) {
        that.$refs.messageBoard.appendText("TIM.EVENT.SDK_NOT_READY");
        // 收到 SDK 进入 not ready 状态通知，此时 SDK 无法正常工作
        // event.name - TIM.EVENT.SDK_NOT_READY
      });

      this.myTim.on(TIM.EVENT.KICKED_OUT, function (event) {
        that.$refs.messageBoard.appendText("TIM.EVENT.KICKED_OUT");
        // 收到被踢下线通知
        // event.name - TIM.EVENT.KICKED_OUT
        // event.data.type - 被踢下线的原因，例如:
        //    - TIM.TYPES.KICKED_OUT_MULT_ACCOUNT 多实例登录被踢
        //    - TIM.TYPES.KICKED_OUT_MULT_DEVICE 多终端登录被踢
        //    - TIM.TYPES.KICKED_OUT_USERSIG_EXPIRED 签名过期被踢 （v2.4.0起支持）。
      });

      this.myTim.on(TIM.EVENT.NET_STATE_CHANGE, function (event) {
        that.$refs.messageBoard.appendText("TIM.EVENT.NET_STATE_CHANGE");
        //  网络状态发生改变（v2.5.0 起支持）。
        // event.name - TIM.EVENT.NET_STATE_CHANGE
        // event.data.state 当前网络状态，枚举值及说明如下：
        //     \- TIM.TYPES.NET_STATE_CONNECTED - 已接入网络
        //     \- TIM.TYPES.NET_STATE_CONNECTING - 连接中。很可能遇到网络抖动，SDK 在重试。接入侧可根据此状态提示“当前网络不稳定”或“连接中”
        //    \- TIM.TYPES.NET_STATE_DISCONNECTED - 未接入网络。接入侧可根据此状态提示“当前网络不可用”。SDK 仍会继续重试，若用户网络恢复，SDK 会自动同步消息
      });
    },
    //华丽的分割线begin
    // step 4 : 登录
    loginAction() {
      let promise = this.myTim.login({
        userID: this.userName,
        userSig: this.userSig
      });

      var that = this;
      promise.then(function (imResponse) {
          that.$refs.messageBoard.appendText(imResponse.data); // 登录成功
          if (imResponse.data.repeatLogin === true) {
            // 标识账号已登录，本次登录操作为重复登录。v2.5.1 起支持
            that.$refs.messageBoard.appendText("imResponse.data.errorInfo");
          }
        })
        .catch(function (imError) {
          that.$refs.messageBoard.appendText("login error:" + imError); // 登录失败的相关信息
        });
    },

    // - (IBAction)loginAction:(id)sender {
    //     TIMLoginParam * login_param = [[TIMLoginParam alloc ]init];
    //     // identifier 为用户名
    //     login_param.identifier = _txtUserName.text;
    //     //userSig 为用户登录凭证
    //     login_param.userSig = _userSig;
    //     //appidAt3rd App 用户使用 OAuth 授权体系分配的 Appid，在私有帐号情况下，填写与 SDKAppID 一样
    //     login_param.appidAt3rd = @"1400343975";
    //     [[TIMManager sharedInstance] login: login_param succ:^(){
    //         [self appendInfoText:@"登录成功"];

    //     } fail:^(int code, NSString * err) {
    //         [self appendInfoText:[NSString stringWithFormat:@"登录失败：：%d->%@", code, err]];
    //     }];
    // }
    //华丽的分割线end
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