<template>
  <div class="acc_List">
    <div class="com_title">帐号列表</div>
    <div class="goods_table">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="帐号" width="180">
          <template slot-scope="scope">{{ scope.row.account}}</template>
        </el-table-column>
        <el-table-column prop="userGroup" label="用户组" width="220"></el-table-column>
        <el-table-column prop="ctime" label="创建时间" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="ediAcc_bord(scope.row)">编辑</el-button>
            <el-button type="danger" @click="delOpen(scope.$index, scope.row)">删除</el-button>
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
        :page-sizes="pageSize_list"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="records_total"
      ></el-pagination>
    </div>
    <div class="btn_item">
      <el-button type="danger" @click="batchDel">批量删除</el-button>
      <el-button type="primary" @click="toggleSelection">取消选择</el-button>
    </div>

    <!-- 对话框 -->
    <el-dialog title="请修改帐号" :visible.sync="dialogFormVisible">
      <el-form>
        <el-form-item label="帐号" :label-width="formLabelWidth">
          <el-input v-model="accountVal"></el-input>
        </el-form-item>
        <el-form-item label="用户组" :label-width="formLabelWidth">
          <el-select v-model="accGroup" placeholder="请选择用户组">
            <el-option label="超级管理员" value="超级管理员"></el-option>
            <el-option label="普通管理员" value="普通管理员"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm_edit_btn">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 引入api 获取帐号列表模块 删除帐号接口 批量删除模块 修改帐号模块
import {
  get_accList,
  del_acc,
  del_batch_acc,
  chang_account
} from "../../api/apis";

export default {
  data() {
    return {
      // 产品列表data
      tableData: [],
      multipleSelection: [], //选中状态的数组
      SelectedId: [],
      currentPage: 1, //当前页码
      records_total: 0, //总记录数
      pageSize_list: [5, 10, 15, 20],
      pageSize: 5,
      dialogFormVisible: false, //模态框未显示,
      accountVal: "", //模态框帐号input值
      accGroup: "", //模态框帐号分组
      formLabelWidth: "100px" //左边label标签宽度
    };
  },
  methods: {
    // 封装获取帐号列表 便于多出调用
    getAccList(size) {
      // 发送请求
      get_accList(this.currentPage, size).then(res => {
        //参数 : 当前页码 ,每页显示记录

        this.tableData = res.data.data; //动态设置表格数据

        this.records_total = res.data.total; //总记录数
      });
    },

    // 点击删除按钮 打开对话框 确认是否删除单个帐号
    delOpen(index, row) {
      //row为当前行的对象
      let para = row.id;

      this.$confirm("此操作将永久删除该帐号, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 发送请求
          del_acc(para).then(res => {
            if (res.data.code == 0) {
              this.$message({
                message: "帐号删除成功",
                type: "success"
              });
              this.getAccList(this.pageSize); //调用获取帐号列表接口
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    // 分页
    handleSizeChange(val) {
      this.pageSize = val
      
      //val为每页显示记录
      this.getAccList(val);
    },
    handleCurrentChange(val) {
      //val为当前页面
      // 调用获取帐号列表发送请求

      this.currentPage = val;
      this.getAccList(this.pageSize);
    },

    // 选中状态改变触发 该事件
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    // 点击批量删除按钮 打开对话框确认是否删除选中的所有帐号
    batchDel() {
      // 遍历数组取出选中状态 对应的id
      this.multipleSelection.forEach(obj => {
        this.SelectedId.push(obj.id); //取出id 推进数组中
      });

      if (this.SelectedId.length == 0) {
         this.$message({
          message: '请选择要删除的帐号',
          type: 'warning'
        });
        return false; //如果没有选择则直接返回
      }
      // 弹出确认框
      this.$confirm("此操作将批量删除选中帐号, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 确认删除帐号, 发送请求;

          del_batch_acc(JSON.stringify(this.SelectedId)).then(res => {
            //将数组转为字符串作为参数传入 发送批量删除请求

            if (res.data.code == 0) {
              this.$message({
                message: "批量删除成功",
                type: "success"
              });
            }

            this.getAccList(this.pageSize); //调用获取帐号列表接口
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    // 点击取消选择
      toggleSelection() {
        this.$refs.multipleTable.clearSelection();
      },

    // 点击编辑弹出模态框
    ediAcc_bord(obj) {
      // 将当前帐号和分组设置给模态框
      this.accountVal = obj.account;
      this.accGroup = obj.userGroup;
      this.dialogFormVisible = true;

      window.paraId = obj.id; //将要编辑的对象的id挂到window 以便兄弟函数能访问到
    },

    // 点击确认编辑按钮 修改帐号信息
    confirm_edit_btn() {
      // 发送请求
      chang_account(window.paraId, this.accountVal, this.accGroup).then(res => {
        if (res.data.code == 0) {
          //修改成功

          this.dialogFormVisible = false; //关闭对话框
          this.$message({
            //发送帐号
            message: "帐号修改成功",
            type: "success"
          });
        }

        this.getAccList(this.pageSize); //调用获取帐号列表接口
      });
    }
  },

  created() {
    this.getAccList(this.pageSize); //调用获取帐号列表接口
  }
};
</script>

<style lang="less" scoped>
.acc_List {
  background: #fff;
  box-shadow: 3px 3px 3px #ebeef5;
  .com_title {
    font-size: 18px;
    border-bottom: 1px solid #ebeef5;
    padding: 15px 20px;
  }
  .goods_table {
    padding: 20px;
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
  }
  .pages {
    padding: 20px;
  }
  .btn_item {
    padding: 0 0 20px 20px;
  }
}
</style>