<template>
  <div class="goodsTyp">
    <div class="com_title">
      <div>商品分类</div>
      <el-button type="primary" @click="dialogFormVisible = true">添加分类</el-button>
    </div>
    <!-- 分类列表 -->
    <div class="type_list">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="序号" width="180" type="index"></el-table-column>
        <el-table-column prop="cateName" label="分类名称" width="480"></el-table-column>
        <el-table-column label="是否启用" >
          <template slot-scope="scope">
            <el-switch active-color="#13ce66" inactive-color="#71E2A3" v-model="scope.row.state" disabled></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button>编辑</el-button>
            <el-button type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
        :page-sizes="pageSizesList"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalRecods"
      ></el-pagination>
    </div>
    <!-- 对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :width="600+'px'"
    >
      <el-form >
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-input v-model="typeName"  placeholder="分类名称"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" :label-width="formLabelWidth">
          <el-switch v-model="switch_val" active-color="#13ce66" inactive-color="#71E2A3" ></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="add_goods_type">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 引入api模块: 获取商品分类列表 , 商品分类删除 , 添加商品分类
import { goods_typeList, del_goodsType ,API_ADD_TYPE} from "../../api/apis";

export default {
  data() {
    return {
      tableData: [], //商品分类列表动态数组
      currentPage: 1, //当前页码
      pageSizesList: [5, 10, 15, 20],
      pageSize: 5, //默认当前每页显示5条
      totalRecods: 0, //总记录数默认为0
      switch_val: false, //模态框switch按钮
      dialogFormVisible: false, //模态框默认隐藏
      typeName: '' , //模态框商品分类名称
      formLabelWidth: "120px"
    };
  },
  methods: {
    //  封装获取商品分类列表
    getGoodsTypeList(pageSiz) {
      // 发送axios请求 获取分类列表
      goods_typeList(this.currentPage, pageSiz).then(res => {

        // 遍历数组 判断每条数据分类启用状态 并重新赋值
        res.data.data.forEach(item => {
          item.state = item.state == 0 ? false : true;
        });

        //参数 : 当前页码 ,每页显示记录
        this.tableData = res.data.data; //将值赋值给表格动态数据

        this.totalRecods = res.data.total; //总记录数目赋值
      });
    },

    // 点击模态框确认按钮 添加商品分类
    add_goods_type(){
      if(!this.typeName){ //如果没有值 则不发送请求 并提示

         this.$message({
          message: '请先输入商品分类名称',
          type: 'warning'
        });
        return ;
      }

      // 有值 则发送请求 添加商品分类
      API_ADD_TYPE(this.typeName ,this.switch_val.toString() ).then(res =>{
  
        if(res.data.code == 0 ){ //商品添加成功
          this.$message({
          message: '商品添加成功',
          type: 'success'
        });
        this.dialogFormVisible = false

        } 
        
      })

    },

    // 分页触发函数
    handleSizeChange(val) {
     this.pageSize =val
      //val为每页显示的条数
      this.getGoodsTypeList(val);
    },
    handleCurrentChange(val) {
      //val为当前多少页
      this.currentPage = val;
      this.getGoodsTypeList(this.pageSize);
    },

    // 删除分类
    handleDelete(index, row) {
      this.$confirm("请确认是否删除分类?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 发送请求删除对应行的id 商品分类
          del_goodsType(row.id).then(res => {
            if (res.data.code == 0) {
              this.$message({
                message: "商品分类删除成功",
                type: "success"
              });
              this.getGoodsTypeList(this.pageSize); 
            }
          });
        })
    }
  },
  created() {
    this.getGoodsTypeList(this.pageSize); //默认每页显示5条
  }
};
</script>

<style lang="less" scoped>
.goodsTyp {
  background: #ffffff;
  .com_title {
    font-size: 18px;
    border-bottom: 1px solid #ebeef5;
    padding: 10px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .type_list {
    padding: 20px;
  }
  .pages {
    padding: 20px;
  }
}
</style>