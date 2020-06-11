<template>
  <div class="shopsStat">
    <div class="search">
        <label >时间范围</label>
      <el-date-picker class="datePicker"
        v-model="value1"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
       <el-button type="primary">查询</el-button>
    </div>
    <div class="echarts">

    </div>
  </div>
</template>

<script>
export default {
    data(){
        return {
            value1: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)]
        }
    }
};
</script>

<style lang="less" scoped>
.shopsStat{
    .search{
        .datePicker{
            margin: 0 10px;
        }
    }
    .echarts{
        width: 100%;
        height: 300px;
        background: #fff;
        margin-top: 30px;
    }
}
</style>