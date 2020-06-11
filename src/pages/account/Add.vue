<template>
  <div class="accAdd">
    <div class="com_title">添加帐号</div>
    <div class="form_bord">
      <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign">
        <el-form-item label="帐号">
          <el-input v-model="formLabelAlign.account"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="formLabelAlign.pwd" type="password"></el-input>
        </el-form-item>
        <el-form-item label="用户组">
          <el-select v-model="roleVal" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addAcc">添加</el-button>
          <el-button @click="resetVal">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// 引入接口api模块

import { add_account } from "../../api/apis";

export default {
  data() {
    return {
      labelPosition: "right",
      formLabelAlign: {
        account: "",
        pwd: "",
        type: "",
        formFlag: true
      },
      options: [
        {
          value: "超级管理员",
          label: "超级管理员"
        },
        {
          value: "普通管理员",
          label: "普通管理员"
        }
      ],
      roleVal: "" 
    };
  },
  methods: {
    resetVal() {
      //重置表单
      this.formLabelAlign.account = "";
      this.formLabelAlign.pwd = "";
      this.roleVal = "";
    },
    // 添加帐号
    addAcc() {
      var that = this; //保存this

      if (this.formFlag == false) return; 

      else {
        if (!this.formLabelAlign.account) {
          this.$message.error("请输入帐号");
        } else if (!this.formLabelAlign.pwd) {
          this.$message.error("请输入密码");
        } else if (!this.roleVal) {
          this.$message.error("请选择用户组");
        } else {
          //发送请求
          add_account(
            this.formLabelAlign.account,
            this.formLabelAlign.pwd,
            this.roleVal
          ).then(res => {
            if (res.data.code == 0) {
              //发送成功
              this.$message({
                message: "帐号添加成功",
                type: "success"
              });
              //清空表单值
              this.formLabelAlign.account = ''
              this.formLabelAlign.pwd = ''
              this.roleVal = ''
              
            } else {
              this.$message({
                message: "帐号添加失败,请重试",
                type: "warning"
              });
            }
          });
        }
      }

      this.formFlag = false;

      setTimeout(() => {
        //3秒钟之后才可以再次点击 防止误操作发送多次请求
        that.formFlag = true;
      }, 3000);

      
    }
  }
};
</script>

<style lang="less" scoped>
.accAdd {
  background: #fff;
  box-shadow: 3px 3px 3px #ebeef5;
  .com_title {
    font-size: 18px;
    border-bottom: 1px solid #ebeef5;
    padding: 15px 20px;
  }
  .form_bord {
    padding: 20px;
    .el-input {
      width: 217px;
    }
  }
}
</style>