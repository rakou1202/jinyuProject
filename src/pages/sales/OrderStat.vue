<template>
  <div class="shopsStat">
    <div class="search">
      <label>时间范围</label>
      <el-date-picker
        class="datePicker"
        v-model="value"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd HH:mm:ss"
      ></el-date-picker>
      <el-button type="primary" @click="searchOrder">查询</el-button>
    </div>
    <div id="echarts_box"></div>
  </div>
</template>

<script>
// 引入API
import { API_ORDER_SALES_TOTAL } from "@/api/apis";
// 引入echarts
import echarts from "echarts";

export default {
  data() {
    return {
      value: [new Date(2020, 5, 1, 0, 0), new Date(2020, 5, 11, 0, 0)] ,//日期值 默认
      orderTime: [] ,//订单时间
      orderAmount: [] //订单金额
    };
  },
  mounted() {
    // mounted中获取节点 使用echarts获取dom容器
    this.myEcharts = echarts.init(document.getElementById("echarts_box"));
    
  },

  methods: {
    // =封装获取后台数据 获取所有订单
    refreshEcharts(date){
       if (this.value.length == 0) return; //如果未选择日期 则返回不发送请求

      //  发送请求 获取报表数据
      API_ORDER_SALES_TOTAL(JSON.stringify(date)).then(res => {

          this.myEcharts.showLoading(); //在请求数据加载完成之前显示echarts加载动画

        // 循环遍历数组
        res.data.data.forEach(i =>{     //将遍历出来的数组赋值给新数组
            this.orderTime.push(i.orderTime)
            this.orderAmount.push(i.orderAmount)
        })
        //  配置图标对象 使echarts根据此对象进行数据渲染
        var option = {
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "cross",
              crossStyle: {
                color: "#999"
              }
            }
          },
          toolbox: {
            feature: {
              dataView: { show: true, readOnly: false },
              magicType: { show: true, type: ["line", "bar"] },
              restore: { show: true },
              saveAsImage: { show: true }
            }
          },
          legend: {
            data: ["订单金额",'订单金额统计']
          },
          xAxis: [
            {
              type: "category",
              data:this.orderTime ,
              axisPointer: {
                type: "shadow"
              }
            }
          ],
          yAxis: [
            {
              type: "value",
              name: "金额",
              min: 0,
              max: 220,
              interval: 40,
              axisLabel: {
                formatter: "{value} 元"
              }
            },
             {
            type: 'value',
            name: '金额统计',
            min: -220,
            max: 220,
            interval: 40,
            axisLabel: {
                formatter: '{value} 元'
            }
        }
          ],
          series: [
            {
              name: "订单金额",
              type: "bar",
              data: this.orderAmount
            },
            {
            name: '订单金额统计',
            type: 'line',
            yAxisIndex: 1,
            data: this.orderAmount
        }
          ]
        };

         // 加载完成后 隐藏加载动画
        this.myEcharts.hideLoading();

        this.myEcharts.setOption(option);

      })
    },
    // 点击查询 发送ajax请求
    searchOrder() {
     this.refreshEcharts(this.value)
    }
  },

  created(){
    
      this.refreshEcharts(this.value)  //设置一个默认值 页面初始化加载
      
  }

};
</script>

<style lang="less" scoped>
.shopsStat {
  .search {
    .datePicker {
      margin: 0 10px;
    }
  }
  #echarts_box {
    width: 100%;
    height: 700px;
    background: #fff;
    margin-top: 30px;
    padding: 30px 20px 0 0;
  }
}
</style>