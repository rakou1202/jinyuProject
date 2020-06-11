<template>
  <div class="goodsAdd">
    <div class="com_title">商品添加</div>
    <!-- 主要内容区域 -->
    <div class="main">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="商品名称"></el-input>
        </el-form-item>
        <el-form-item label="商品分类" prop="region">
          <el-select v-model="ruleForm.region" placeholder="请选择商品分类">
            <el-option v-for="(item ,index) of select_options" :key="index" :label="item.cateName" :value="item.cateName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品价格">
          <el-input-number v-model="price" :min="1" :max="10000" label="商品价格"></el-input-number>
        </el-form-item>
        <el-form-item label="商品图片" class="goodsImgItem">
          <el-upload
            class="avatar-uploader"
            action="http://127.0.0.1:5000/goods/goods_img_upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            required
           
          >
            <img v-if="ruleForm.imageUrl" :src="ruleForm.imageUrl" 
            :data-img="ruleForm.imgVal" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <div class="errorMsg" v-show="errImg_msg">请上传商品图片</div>
        </el-form-item>

        <el-form-item label="商品描述" prop="descript">
          <el-input
            class="goods_descri"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            v-model="ruleForm.descript"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">添加商品</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// 引入api模块
import { API_ADD_GOODS ,API_GET_ALLTYPE} from "../../api/apis";
export default {
  data() {
    return {
      price: 1, //商品价格默认值
      // 表单验证值
      ruleForm: {
        name: "", //商品名称
        region: "", //商品分类
        descript: "",
        imageUrl: "" ,//图片路径, 显示图片
        imgVal: '' ,   //表单提交要上传的值
      }, 
       // 表单验证规则
      rules: {
        name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" }
        ],
        region: [
          { required: true, message: "请选择商品分类", trigger: "change" }
        ],
        descript: [
          { required: true, message: "请输入商品描述", trigger: "blur" },
          { min: 2, maix: 5, message: "至少输入2个字符", trigger: "blur" }
        ]
      },
      errImg_msg: false,
      select_options :[] //定义商品分类下拉选项
    };
  },
  methods: {
    //   表单提交事件
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        this.validStatus = valid
        // if (!this.ruleForm.imgVal) {
        //   valid = false;
        //   this.errImg_msg = true;
        // } else {
        //   valid = true;
        //   this.errImg_msg = false;
        // }
        if (valid) {
          //表单验证成功 发送添加商品请求
          API_ADD_GOODS(
            this.ruleForm.name,
            this.ruleForm.region,
            this.price,
            this.ruleForm.imgVal,
            this.ruleForm.descript
          ).then(res => {
            
            if (res.data.code == 0) {
              this.$message({
                message: "添加商品成功",
                type: "success"
              });
              // 清空表单
               this.$refs[formName].resetFields();
               this.ruleForm.imageUrl = ''

              var that = this; //保存this
              setTimeout(function() {  //1.5秒后跳转到首页
                that.$router.push("/index/goodslist");
              }, 1500);
            }
          });
        } else {
          //表单验证失败
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 上传图片成功函数
    handleAvatarSuccess(res , file) {
      console.log(res);

      this.ruleForm.imageUrl = URL.createObjectURL(file.raw); //显示图片路径
       this.ruleForm.imgVal = res.imgUrl  //将相应的服务器图片地址赋值给要添加商品的参数中
      
     
      // console.log(this.ruleForm.imageUrl);
      
      if (res.code !== 0) {
        //图片上传失败
      }
    },
    beforeAvatarUpload(file) {
      if(!file){

      this.validStatus = false
      this.errImg_msg = true;

      }
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    }
  },

  created(){
    // 发送请求 获取所有分类名称
    API_GET_ALLTYPE().then(res =>{
    
      this.select_options = res.data.categories
      
    })
  }
};
</script>

<style lang="less" scoped>
.goodsAdd {
  background: #fff;
  width: 100%;
  .com_title {
    font-size: 18px;
    border-bottom: 1px solid #ebeef5;
    padding: 15px 20px;
  }
  .main {
    padding: 30px 0;
    .goodsImgItem {
      position: relative;
      .errorMsg {
        color: red;
        font-size: 12px;
        position: absolute;
        bottom: -29px;
        left: 0;
      }
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
    // 输入框
    .el-input {
      width: 500px;
    }
    .goods_descri {
      width: 500px;
    }
  }
}
</style>