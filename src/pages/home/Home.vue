<template>
  <div class="box">
    <div class="content">
      <div class="order_view">
        <div class="item">
          <div class="left">
            <img src="../../assets/imgs/order1.png" alt />
          </div>
          <div class="right">
            <div class="title">总订单</div>
            <p>{{totalOrder}}</p>
          </div>
        </div>
        <div class="item">
          <div class="left">
            <img src="../../assets/imgs/money1.png" alt />
          </div>
          <div class="right">
            <div class="title">总销售额</div>
            <p>{{totalAmount}}</p>
          </div>
        </div>
        <div class="item">
          <div class="left">
            <img src="../../assets/imgs/order2.png" alt />
          </div>
          <div class="right">
            <div class="title">今日订单</div>
            <p>{{todayOrder}}</p>
          </div>
        </div>
        <div class="item">
          <div class="left">
            <img src="../../assets/imgs/money2.png" alt />
          </div>
          <div class="right">
            <div class="title">今日销售额</div>
            <p>{{totayAmount}}</p>
          </div>
        </div>
      </div>
      <!-- 给一个dom容器加载echarts -->
      <div id="echartsBox"></div>
    </div>
  </div>
</template>

<script>
// 1. 引入echarts
import echarts from "echarts";

// 引入API
import { API_ORDER_TOTAL } from "@/api/apis";

export default {
  data() {
    return {
      todayOrder: 0,
      totalAmount: 0,
      totalOrder: 0,
      totayAmount: 0
    };
  },

  mounted() {
    //  2. 使用echarts初始化dom容器
    var myEcharts = echarts.init(document.getElementById("echartsBox"));

    myEcharts.showLoading(); //在请求数据加载完成之前显示加载动画

    var that = this; //保存this

    // 调用接口 获取报表数据 赋值到echarts数据配置对象中
    setTimeout(function() {
      API_ORDER_TOTAL().then(res => {
        let {
          amountData,
          orderData,
          todayOrder,
          totalAmount,
          totalOrder,
          totayAmount,
          xData
        } = res.data;
        that.todayOrder = todayOrder; //今日订单
        that.totalAmount = totalAmount; //总销售额
        that.totalOrder = totalOrder; //总订单
        that.totayAmount = totayAmount; //今日销售饿

        // 配置表格对象 使echarts根据此对象进行渲染
        let option = {
          title: {
            text: "数据统计"
          },
          tooltip: {
            trigger: "axis"
          },
          legend: {
            data: ["订单数据", "金额数据"]
          },
          grid: {
            //网格
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true
          },
          xAxis: {
            type: "category",
            boundaryGap: false,
            data: xData
          },
          yAxis: {
            type: "value"
          },
          series: [
            {
              name: "订单数据",
              type: "line",
              stack: "总量",
              data: orderData
            },
            {
              name: "金额数据",
              type: "line",
              stack: "总量",
              data: amountData
            }
          ]
        };

        // 加载完成后 隐藏加载动画
        myEcharts.hideLoading();

        // 使用指定的配置表格对象 显示echarts
        myEcharts.setOption(option);
      });
    }, 2000);
  }
};
</script>

<style lang="less" scoped>
.box {
  width: 100%;
}
.content {
  width: 100%;
  .order_view {
    display: flex;
    justify-content: space-between;
    .item {
      width: 18%;
      background: #fff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 20px 10px 20px;
      margin: 0 20px;
      img {
        width: 80px;
      }
      .right {
        text-align: center;
        .title {
          color: #ccc;
          margin-bottom: 10px;
          font-size: 18px;
        }
        p {
          font-weight: bold;
        }
      }
    }
  }
  #echartsBox {
    width: 1200px;
    height: 500px;
    background: #fff;
    margin: 50px 0 0 20px;
    padding: 50px;
  }
}
</style>