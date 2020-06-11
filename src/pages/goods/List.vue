<template>
  <div class="goodsList">
    <div class="com_title">商品列表</div>
    <div class="goods_table">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="商品 ID">
                <span>{{ props.row.id }}</span>
              </el-form-item>
              <el-form-item label="所属分类">
                <span>{{ props.row.category }}</span>
              </el-form-item>
              <el-form-item label="商品图片">
                <span>
                  <img :src="'http://127.0.0.1:5000/upload/imgs/goods_img/'+ props.row.imgUrl " alt />
                </span>
              </el-form-item>
              <el-form-item label="商品评价">
                <span>{{ props.row.rating }}</span>
              </el-form-item>
              <el-form-item label="商品描述">
                <span>{{ props.row.goodsDesc }}</span>
              </el-form-item>
              <el-form-item label="商品名称">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="商品价格" :width="pricColWid">
                <span>{{ props.row.price }}</span>
              </el-form-item>
              <el-form-item label="创建时间">
                <span>{{ props.row.ctime }}</span>
              </el-form-item>
              <el-form-item label="商品销量">
                <span>{{ props.row.sellCount }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="商品名称" prop="name"></el-table-column>
        <el-table-column label="所属分类" prop="category" width="160px"></el-table-column>
        <el-table-column label="商品价格" prop="price" width="120px"></el-table-column>
        <el-table-column label="商品图片" prop="desc" width="120px">
          <template slot-scope="scope">
            <img :src="'http://127.0.0.1:5000/upload/imgs/goods_img/'+ scope.row.imgUrl" alt />
          </template>
        </el-table-column>
        <el-table-column label="商品描述" prop="goodsDesc" width="320px"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit( scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="pages">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalRecords"
      ></el-pagination>
    </div>
    <!-- 编辑商品内容模态框 -->
    <el-dialog title="修改商品" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form :model="ruleForm">
        <el-form ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="商品名称" prop="name">
            <el-input v-model="ruleForm.name" placeholder="商品名称"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" prop="region">
            <el-select v-model="ruleForm.region" placeholder="请选择商品分类">
              <el-option
                v-for="(item ,index) of select_options"
                :key="index"
                :label="item.cateName"
                :value="item.cateName"
              ></el-option>
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
              required
            >
              <img
                v-if="ruleForm.imageUrl"
                :src="ruleForm.imageUrl"
                :data-img="ruleForm.imgVal"
                class="avatar"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>

          <el-form-item label="商品描述" prop="descript">
            <el-input
              class="goods_descri"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              v-model="ruleForm.descript"
            ></el-input>
          </el-form-item>
        </el-form>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm_change">确认修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 引入api 模块 添加商品  获取商品分类列表  修改商品 删除商品
import {
  API_GOODS_LIST,
  API_GET_ALLTYPE,
  API_CHANGE_GOODS,
  API_DEL_GOODS
} from "../../api/apis";
export default {
  data() {
    return {
      // 产品列表data
      tableData: [],
      currentPage: 1, //当前页面
      pageSizes: [5, 10, 15, 20, 25],
      pageSize: 5, //每页显示5条
      totalRecords: 0, //总记录数
      pricColWid: "150px",
      dialogTableVisible: false, //模态框
      dialogFormVisible: false,

      price: 1, //商品价格默认值

      // 模态框的内容
      ruleForm: {
        name: "", //商品名称
        region: "", //商品分类
        descript: "", //商品描述
        imageUrl: "", //图片路径, 显示图片
        imgVal: "" //表单提交要上传的值
      },
      formLabelWidth: "120px",
      select_options: [] //定义商品分类下拉选项
    };
  },

  methods: {
    // 封装 获取获取商品列表
    refreshTab(size) {
      // 页面初始化 发送请求 获取商品列表
      API_GOODS_LIST(this.currentPage, size).then(res => {
        this.tableData = res.data.data;
        this.totalRecords = res.data.total;
      });
    },

    // 分页
    handleSizeChange(val) {
      //val为每页多少条
      this.pageSize = val;

      this.refreshTab(val); //调用函数
    },
    handleCurrentChange(val) {
      //val为当前页码
      this.currentPage = val;
      this.refreshTab(this.pageSize); //调用函数
    },

    // 编辑打开编辑商品内容模态框
    handleEdit(row) {
      this.change_goodsId = row.id; //将选中行id赋值挂在this上以便兄弟函数访问
      this.dialogFormVisible = true; //显示模态框

      // 显示默认值
      this.ruleForm.name = row.name; //商品名
      this.ruleForm.region = row.category; //商品分类
      this.ruleForm.descript = row.goodsDesc; //商品描述
      this.price = row.price;
      this.ruleForm.imageUrl =
        "http://127.0.0.1:5000/upload/imgs/goods_img/" + row.imgUrl; //默认显示商品图片
      this.ruleForm.imgVal = row.imgUrl; //默认要提交的图片地址是原来的
      this.price = row.price; //商品价格
    },
    // 点击确认修改按钮 发送修改请求
    confirm_change() {
      console.log(this.change_goodsId);
      API_CHANGE_GOODS(
        this.change_goodsId,
        this.ruleForm.name,
        this.ruleForm.region,
        this.price,
        this.ruleForm.imgVal,
        this.ruleForm.descript
      ).then(res => {
        if (res.data.code == 0) {
          //商品修改成功
          this.$message({
            message: "商品修改成功",
            type: "success"
          });
          this.dialogFormVisible = false; //关闭模态框
          this.refreshTab(this.pageSize); //调用函数 重新获取商品列表
        }
      });
    },

    // 点击删除按钮 弹出对话框
    handleDelete(row) {

      this.$confirm("此操作将永久删除该该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        //确定删除 发送删除请求

        API_DEL_GOODS(row.id).then(res => {
          if (res.data.code == 0) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.refreshTab(this.pageSize); //调用函数 重新获取列表
          } else {
            this.$message({
              message: "商品删除失败,请重试",
              type: "success"
            });
          }
        });
      });
    },

    // 上传图片成功函数
    handleAvatarSuccess(res, file) {
      console.log(res);

      this.ruleForm.imageUrl = URL.createObjectURL(file.raw); //显示图片路径
      this.ruleForm.imgVal = res.imgUrl; //将相应的服务器图片地址赋值给要添加商品的参数中

      if (res.code !== 0) {
        //图片上传失败
      }
    }
  },

  created() {
    this.refreshTab(this.pageSize);

    // 发送请求 获取所有分类名称
    API_GET_ALLTYPE().then(res => {
      this.select_options = res.data.categories;
    });
  }
};
</script>

<style lang="less" scoped>
.goodsList {
  background: #fff;
  box-shadow: 3px 3px 3px #ebeef5;
  .com_title {
    font-size: 18px;
    border-bottom: 1px solid #ebeef5;
    padding: 15px 20px;
  }
  .goods_table {
    .demo-table-expand {
      font-size: 0;
    }
    .demo-table-expand label {
      width: 90px;
      color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: 50%;
    }
    img {
      width: 50px;
    }
  }
  .pages {
    padding: 20px;
  }
  .el-dialog {
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