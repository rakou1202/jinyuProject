<template>
  <div class="box">
    <div class="content">
      <div class="input_bord">
        <div class="input_item">
          <label for="orderNo">订单号</label>:
          <el-input placeholder="订单号" id="orderNo" v-model="orderNo"></el-input>
        </div>
        <div class="input_item">
          <label for="consignee">收货人</label>:
          <el-input placeholder="收货人" id="consignee" v-model="consignee"></el-input>
        </div>
        <div class="input_item">
          <label for="telNo">手机号</label>:
          <el-input placeholder="手机号" id="telNo" v-model="phoneNo"></el-input>
        </div>
        <div class="input_item">
          <label for="orderSta">订单状态:</label>
          <el-select v-model="sel_value" clearable placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="dateSele">
        <label>请选择日期:</label>
        <el-date-picker
          class="datePicker"
          v-model="dateValue"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
        ></el-date-picker>
        <el-button type="primary" @click="searchOrder">查询</el-button>
      </div>
      <!-- 订单列表 -->
      <div class="order_list">
        <el-table :data="orderList" border style="width: 100%">
          <el-table-column fixed prop="orderNo" label="订单号" width="120"></el-table-column>
          <el-table-column prop="orderTime" label="下单时间" width="200"></el-table-column>
          <el-table-column prop="phone" label="手机号" width="120"></el-table-column>
          <el-table-column prop="consignee" label="收货人" width="120"></el-table-column>
          <el-table-column prop="deliverAddress" label="配送地址" width="180"></el-table-column>
          <el-table-column prop="deliveryTime" label="送达时间" width="220"></el-table-column>
          <el-table-column prop="remarks" label="用户备注" width="120"></el-table-column>
          <el-table-column prop="orderAmount" label="订单金额" width="120"></el-table-column>
          <el-table-column prop="orderState" label="订单状态" width="120"></el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="checkOrderDet(scope.row)">查看</el-button>
              <el-button type="text" size="small" @click="handleClick(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页组件 -->
      <div class="page">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="pageSizeList"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalRecords"
        ></el-pagination>
      </div>

      <!-- 模态框 修改订单详情 -->
      <el-dialog
        title="修改订单"
        class="getinfo"
        :visible.sync="dialogFormVisible"
        :close-on-click-modal="false"
      >
        <el-form>
          <el-form-item label="订单id" :label-width="formLabelWidth">
            <el-input v-model="defalut_orderId" disabled></el-input>
          </el-form-item>
          <el-form-item label="订单号" :label-width="formLabelWidth">
            <el-input v-model="defalut_orderNo"></el-input>
          </el-form-item>
          <el-form-item label="下单时间" :label-width="formLabelWidth">
            <el-date-picker v-model="defalut_orderTime" type="date" placeholder="选择日期时间" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
          </el-form-item>
          <el-form-item label="联系电话" :label-width="formLabelWidth">
            <el-input v-model="defalut_phone"></el-input>
          </el-form-item>
          <el-form-item label="收货人" :label-width="formLabelWidth">
            <el-input v-model="defalut_consignee"></el-input>
          </el-form-item>
          <el-form-item label="送货地址" :label-width="formLabelWidth">
            <el-input v-model="defalut_deliverAddress"></el-input>
          </el-form-item>
          <el-form-item label="送达时间" :label-width="formLabelWidth">
            <el-date-picker v-model="defalut_deliveryTime" type="date" placeholder="选择日期时间" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
          </el-form-item>
          <el-form-item label="订单金额" :label-width="formLabelWidth">
            <el-input v-model="defalut_orderAmount"></el-input>
          </el-form-item>
          <el-form-item label="订单状态" :label-width="formLabelWidth">
            <el-select v-model="defalut_orderState" placeholder="请选择订单状态">
              <el-option label="已受理" value="已受理"></el-option>
              <el-option label="派送中" value="派送中"></el-option>
              <el-option label="已完成" value="已完成"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" :label-width="formLabelWidth">
            <el-input v-model="defalut_remarks"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="change_order">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 模态框 点击产看订单详情 -->
      <el-dialog
        title="查看订单详情"
        class="changeinfo"
        :visible.sync="model_visble"
        :close-on-click-modal="false"
      >
        <div class="itemList">
          <div class="item">
            <label>订单id:</label>
            <span>{{defalut_orderId}}</span>
          </div>
          <div class="item">
            <label>订单号:</label>
            <span>{{defalut_orderNo}}</span>
          </div>
          <div class="item">
            <label>下单时间:</label>
            <span>{{defalut_orderTime}}</span>
          </div>
          <div class="item">
            <label>联系电话:</label>
            <span>{{defalut_phone}}</span>
          </div>
          <div class="item">
            <label>联系人:</label>
            <span>{{defalut_consignee}}</span>
          </div>
          <div class="item">
            <label>送货地址:</label>
            <span>{{defalut_deliverAddress}}</span>
          </div>
          <div class="item">
            <label>收货时间:</label>
            <span>{{defalut_deliveryTime}}</span>
          </div>
          <div class="item">
            <label>订单金额:</label>
            <span>{{defalut_orderAmount}}</span>
          </div>
          <div class="item">
            <label>订单状态:</label>
            <span>{{defalut_orderState}}</span>
          </div>
          <div class="item">
            <label>备注:</label>
            <span>{{defalut_remarks}}</span>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="model_visble = false">取 消</el-button>
          <el-button type="primary" @click="model_visble = false">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
// 引入API 获取订单列表 查询订单列表 获取订单详情 修改订单
import {
  API_ORDER_LIST,
  API_SEARCH_ORDER,
  API_ORDER_DETAIL ,
  // API_ORDER_CHANGE
} from "../../api/apis";
export default {
  data() {
    return {
      // 下拉框选项
      options: [
        {
          value: "已受理",
          label: "已受理"
        },
        {
          value: "派送中",
          label: "派送中"
        },
        {
          value: "已完成",
          label: "已完成"
        }
      ],

      orderNo: "", //订单号输入框
      consignee: "", //收货人
      phoneNo: "", //手机号
      sel_value: "", //下拉框订单状态value
      dateValue: [], //日期值

      orderList: [], // 订单列表数据
      currentPage: 1, //分页
      pageSizeList: [5, 10, 15, 20],
      pageSize: 5,
      totalRecords: 0, //总记录数目
      dialogFormVisible: false, //查看订单模态框默认不显示
      model_visble: false, //修改订单模态框 默认不显示
      formLabelWidth: "120px",
      // 查看订单详情
      defalut_orderId: "",
      defalut_orderNo: "",
      defalut_orderTime: "",
      defalut_phone: "",
      defalut_consignee: "",
      defalut_deliverAddress: "",
      defalut_deliveryTime: "",
      defalut_remarks: "",
      defalut_orderAmount: "",
      defalut_orderState: ""
    };
  },

  methods: {
    // 封装函数 获取订单列表
    // 可选参数 ,orderNo ,consignee,phone,orderState,date
    refreshTable(pageSize) {
      // 发送请求 获取订单列表
      API_ORDER_LIST(this.currentPage, pageSize).then(res => {
        this.totalRecords = res.data.total;
        this.orderList = res.data.data;
      });
    },

    // 分装函数获取订单详情 以便多处调用
    refreshOrderDetial(id){
       // 发送axios 获取订单详情
      API_ORDER_DETAIL(id).then(res => {
        let {
          id,
          orderNo,
          orderTime,
          phone,
          consignee,
          deliverAddress,
          deliveryTime,
          remarks,
          orderAmount,
          orderState
        } = res.data.data;
          this.defalut_orderId = id;
          this.defalut_orderNo = orderNo,
          this.defalut_orderTime = orderTime,
          this.defalut_phone = phone,
          this.defalut_consignee = consignee,
          this.defalut_deliverAddress = deliverAddress,
          this.defalut_deliveryTime = deliveryTime,
          this.defalut_remarks = remarks,
          this.defalut_orderAmount = orderAmount,
          this.defalut_orderState = orderState;
      });
    },


    // 分页触发函数
    handleSizeChange(val) {
      //val为每页多少条
      // console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.refreshTable(val);
    },
    handleCurrentChange(val) {
      //val为当前页
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.refreshTable(this.pageSize);
    },

    // 点击查询 获取订单列表数据
    searchOrder() {
      // 发送请求 获取订单列表
      this.dateValue = JSON.stringify(this.dateValue);

      API_SEARCH_ORDER(
        this.currentPage,
        this.pageSize,
        this.orderNo,
        this.consignee,
        this.phoneNo,
        this.sel_value,
        this.dateValue
      ).then(res => {
        this.totalRecords = res.data.total;
        this.orderList = res.data.data;
      });

      // 清空输入框数据
      (this.orderNo = ""), //订单号输入框
        (this.consignee = ""), //收货人
        (this.phoneNo = ""), //手机号
        (this.sel_value = ""), //下拉框订单状态value
        (this.dateValue = []); //日期值
    },

    // 点击编辑打开模态框 修改订单
    handleClick(row) {

      this.dialogFormVisible = true; //打开模态框
      this.refreshOrderDetial(row.id) //调用函数 获取订单详情

    },

    // 点击确定修改 修改订单
    change_order(){
      //  // 
      console.log(this.defalut_orderId, this.defalut_orderNo,this.defalut_orderTime,this.defalut_phone,this.defalut_consignee,this.defalut_deliverAddress,this.defalut_deliveryTime,this.defalut_remarks,
      this.defalut_orderAmount,this.defalut_orderState);
      
      // API_ORDER_CHANGE(this.defalut_orderId, this.defalut_orderNo,this.defalut_orderTime,this.defalut_phone,this.defalut_consignee,this.defalut_deliverAddress,this.defalut_deliveryTime,this.defalut_remarks,
      // this.defalut_orderAmount,this.defalut_orderState).then(res=>{
      //   console.log(res.data);
        
      // })
    },

    // 点击查看按钮 打开模态框 查看订单详情
    checkOrderDet(row) {
      this.model_visble = true;
      // 发送axios 获取订单详情
      this.refreshOrderDetial(row.id)
      // 发送aixos 提交修改内容 

    }
  },

  created() {
    this.refreshTable(this.pageSize); //初始化调用获取订单列表函数
  }
};
</script>

<style lang="less" scoped>
.box {
  width: 100%;
  height: 100%;
  background: #fff;
  .content {
    .input_bord {
      display: flex;
      flex-wrap: wrap;
      padding: 20px;
      .input_item {
        width: 300px;
        display: flex;
        line-height: 42px;
        .el-input {
          width: 200px;
          margin-left: 10px;
        }
        .el-select {
          width: 200px;
          margin-left: 10px;
        }
        label {
          width: 70px;
          text-align: right;
        }
      }
    }
    .dateSele {
      margin: 0 0 30px 36px;
      label {
        margin-right: 10px;
      }
      .el-button {
        margin-left: 20px;
      }
    }
    .order_list {
      padding: 38px 250px 45px 38px;
    }
    .page {
      padding-left: 20px;
    }
    .itemList {
      .item {
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        padding-left: 30px;
        label {
          margin-right: 20px;
          width: 100px;
          text-align: right;
          display: inline-block;
        }
        span {
          color: #409eff;
        }
      }
    }
  }
}
</style>