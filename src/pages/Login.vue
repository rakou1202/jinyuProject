<template>
  <div class="Login">
    <div class="login_bord">
      <h2>正黄集团后台管理系统 - 登录</h2>
      <div>
        <el-input v-model="userval" placeholder="用户名"></el-input>
      </div>
      <div>
        <el-input placeholder="密码" v-model="password" show-password></el-input>
      </div>
      <div>
        <el-button type="primary" class="login_btn" @click="loginBtn">登录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
// 引入接口api文件
import { Login_API } from "../api/apis"; //普通引入时要解构

export default {
  data() {
    return {
      userval: "", //帐号input值
      password: "", //密码
      LoginFlag: true //登录标杆,实现防抖节流 防止用户误操作短期内多次点击多次请求数据
    };
  },
  methods: {
    loginBtn() {
      var that = this; //定义变量保存this 指向当前最大组件

      if (this.LoginFlag == false) return; //LoginFlag为false则不发送请求

      // 判断如果值为空 触发
      if (!(this.userval && this.password)) {
        this.$message({
          message: "请输入用户名和密码",
          type: "warning"
        });
      } else {
        // 发送登录请求
        Login_API(this.userval, this.password).then(res => {
          if (res.data.code == 0) {
            //登录成功
            this.$message({
              message: "恭喜你，登录成功",
              type: "success"
            });

            // 将token和用户名 用户id存入到本地存储
            localStorage.token = res.data.token
            localStorage.username = this.userval
            localStorage.id = res.data.id
            localStorage.role = res.data.role
            

            setTimeout(function() {
              that.$router.push("./index/home");
            }, 1500);
          } else {
            that.$message.error("您的帐号或密码错误,请重试");
          }
        });
      }

      // 将LoginFlag 设置为false 防止用户误操作短期内多次点击多次请求数据
      this.LoginFlag = false;

      setTimeout(() => {
        //flag3秒钟之后设置为true 才能再次点击发送请求
        that.LoginFlag = true;
      }, 3000);
      
    }
  }
};
</script>

<style lang="less" scoped>
.Login {
  background: rgba(45, 58, 75);
  color: white;
  width: 100%;
  height: 100%;
  .login_bord {
    width: 350px;
    height: 450px;
    padding: 30px 50px;
    color: #000;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    text-align: center;
    h2 {
      color: white;
      font-size: 20px;
      padding: 20px 0;
      margin-bottom: 30px;
    }
    div {
      margin-bottom: 20px;
      input {
        border: 1px solid white;
        background: transparent;
      }
      .login_btn {
        width: 100%;
      }
    }
  }
}
</style>