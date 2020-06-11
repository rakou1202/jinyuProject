<template>
  <div class="shops_manage">
    <div class="com_title">店铺管理</div>
    <!-- 主要内容区域 -->
    <div class="main">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="店铺名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="店铺公告" prop="notice">
          <el-input
            class="goods_descri"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            v-model="ruleForm.notice"
          ></el-input>
        </el-form-item>
        <el-form-item label="店铺头像">
          <div class="demo-image">
            <div class="block">
              <el-image
                style="width: 100px; height: 100px"
                src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
                fit="cover"
              ></el-image>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="店铺图片">
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt />
          </el-dialog>
        </el-form-item>
        <el-form-item label="配送费" prop="money">
          <el-input v-model="ruleForm.money"></el-input>
        </el-form-item>
        <el-form-item label="配送时间" prop="sendTime">
          <el-input v-model="ruleForm.sendTime"></el-input>
        </el-form-item>
        <el-form-item label="配送描述" prop="descript">
          <el-input v-model="ruleForm.descript"></el-input>
        </el-form-item>
        <el-form-item label="店铺评分" prop="score">
          <el-input v-model="ruleForm.score"></el-input>
        </el-form-item>
        <el-form-item label="销量" prop="sales">
          <el-input v-model="ruleForm.sales"></el-input>
        </el-form-item>
        <el-form-item label="活动" prop="money">
          <el-checkbox-group v-model="ruleForm.type">
            <el-checkbox label="在线支付满28减5" name="type" checked></el-checkbox>
            <el-checkbox label="VC无限橙果汁8折" name="type" checked></el-checkbox>
            <el-checkbox label="单人精彩套餐" name="type" checked></el-checkbox>
            <el-checkbox label="特价饮品8折抢购" name="type"></el-checkbox>
            <el-checkbox label="单人特色套餐" name="type"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="营业时间" prop="money">
          <el-date-picker
            v-model="dateVal"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      // 表单验证规则
      ruleForm: {
        name: "粥品香坊(天府新谷)", //商品名称
        notice: "", //店铺公告
        money: "4元",
        sendTime: '38分钟' ,
        descript: '蜂鸟专送' ,
        score: '4.5', //店铺评分
        sales: 100 , //销量
        type: [],
      },
      rules: {
        name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 2 到 5 个字符", trigger: "blur" }
        ],
        notice: [
          { required: true, message: "请输入店铺公告", trigger: "blur" },
          { min: 3, maix: 5, message: "至少输入2个字符", trigger: "blur" }
        ]
      },
      dateVal: ""
    };
  },
  methods: {
    //   表单提交事件
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) { //表单验证成功
          alert("submit!");
        } 
      });
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    }
  }
};
</script>

<style lang="less" scoped>
.shops_manage {
  background: #fff;
  width: 100%;
  .com_title {
    font-size: 18px;
    border-bottom: 1px solid #ebeef5;
    padding: 15px 20px;
  }
  .main {
    padding: 30px 0;
    .el-form-item{
      width: 500px;
    }
    //  图片上传
    .avatar-uploader {
      width: 180px;
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .avatar-uploader:hover {
      border-color: #409eff;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
  }
}
</style>