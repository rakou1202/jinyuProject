<template>
  <div class="accAdd">
    <div class="com_title">修改密码</div>
    <div class="form_bord">
      <!-- 表单区域 -->
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="原密码" prop="age">
          <el-input v-model="ruleForm.age" type="password"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetVal('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// 引入api 验证旧密码  , 修改新密码
import { check_oldPwd, edit_newPwd } from "../../api/apis";

export default {
  data() {
    var checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("原密码不能为空"));
      } else {
        // 发送axios请求 验证旧密码是否正确
        check_oldPwd(localStorage.id, value).then(res => {
          if (res.data.code == 1) {
            //验证失败
            callback(new Error("原密码输入错误"));
          } else {
            callback();
          }
        });
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback(); //必须要使用回调函数才能进行表单提交
      }
    };
    return {
      ruleForm: {
        pass: "",
        checkPass: "",
        age: ""
      },
      rules: {
        age: [{ validator: checkAge, trigger: "blur" }],
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }]
      }
    };
  },
  methods: {
    // 重置按钮
    resetVal(formName) {
      this.$refs[formName].resetFields();
    },

    submitForm(formName) {
      var that = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          //表单验证通过 发送修改帐号接口
          edit_newPwd(localStorage.id, this.ruleForm.pass).then(res => {
            if (res.data.code == 0) {
              //修改成功

              this.$message({
                message: `密码修改成功,请重新登录`,
                type: "success"
              });

              setTimeout(function() {
                that.$router.push("/");
              }, 2000);
            }
          });
        }
      });
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