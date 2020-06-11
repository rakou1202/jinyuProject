<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>管理员信息</span>
    </div>
    <div class="itemList">
      <div class="item">
        <label>管理员ID:</label>
        <span>{{accountinfo.id}}</span>
      </div>
      <div class="item">
        <label>帐号:</label>
        <span>{{accountinfo.account}}</span>
      </div>
      <div class="item">
        <label>用户组:</label>
        <span>{{accountinfo.userGroup}}</span>
      </div>
      <div class="item">
        <label>创建时间:</label>
        <span>{{accountinfo.ctime}}</span>
      </div>
      <div class="item pic-item">
        <label>管理员头像:</label>
        <div>
          <el-upload
            action="http://127.0.0.1:5000/users/avatar_upload"
            list-type="picture-card"
            :on-success="handlePictureCardPreview"
            :data="data"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
// 引入API 模块
import { get_personal } from "../../api/apis";

export default {
  data() {
    return {
      accountinfo: {}, //帐号信息
      data: { id: localStorage.id }, //上传图片参数
    };
  },
  methods: {
    handlePictureCardPreview() { //文件上传成功时
     
      window.location.reload()
    }
  },
  created() {
    // 页面初始化下 发送axios请求
    get_personal(localStorage.id).then(res => {

      this.accountinfo = res.data.accountInfo; //将帐号信息动态赋值给accountinfo
    });

  }
};
</script>

<style lang="less" scoped>
.box-card {
  .item {
    line-height: 60px;
    border-bottom: 1px solid #dcdfe6;
    display: flex;
    label {
      margin-right: 20px;
      font-weight: bold;
    }
  }
  .pic-item{
    padding: 20px 0;
  }

}
</style>