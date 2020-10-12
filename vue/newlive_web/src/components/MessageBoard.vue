<template>
  <div class="mb_box">
    <el-input
      id="textAreaId"
      ref="myTextArea"
      type="textarea"
      v-model="msgText"
      resize="none"
      :readonly="true"
    >
    </el-input>
    <el-button @click="clearBoard">清空</el-button>
  </div>
</template>

<script>
import { formatDate } from "../utils/common";

export default {
  data() {
    return {
      msgText: "",
    };
  },
  methods: {
    clearBoard() {
      this.msgText = "";
    },

    appendText(info) {
      const textarea = document.getElementById("textAreaId");

      var date = new Date();
      var curTimeStr = formatDate("yyyy-MM-dd hh:mm:ss", date);

      var lineFeedChar = "";
      if (this.msgText != "") {
        lineFeedChar = "\n";
      }
      this.msgText += lineFeedChar + "[" + curTimeStr + "] " + info;

      this.$nextTick(function () {
        textarea.scrollTop = textarea.scrollHeight;
      });
    }
  },
}

</script>

<style>
.mb_box {
  width: 450px;
  height: 240px;
  text-align: right;
}

.mb_box textarea {
  width: 100%;
  height: 200px;
  background-color: #000;
  color: #fff;
}

.mb_box button {
  width: 85px;
  margin-right: -5px;
}
</style>