<template>
  <div class="menu">
    <el-row class="tac">
      <el-col :span="12">
        <h5 class="system_name">正黄后台管理中心</h5>
        <el-menu
          v-for="item in treeList"
          :key="item.index"
          default-active="/index/home"
          class="el-menu-vertical-demo"
          background-color="#304156"
          text-color="#fff"
          active-text-color="#ffd04b"
          router
        >
          <div v-if="item.children" >
            <el-submenu v-for="child in item.children" :key="child.index" :index="item.index">
              <template slot="title">
                <i :class="item.iclass"></i>
                <span>{{item.title}}</span>
              </template>
              <el-menu-item-group >
                <el-menu-item :index="child.index">{{child.title}}</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </div>
         <div v-else>
            <el-menu-item :index="item.index">
            <i :class="item.iclass"></i>
            <span slot="title">{{item.title}}</span>
          </el-menu-item>
         </div>
          <!-- <el-menu-item index="/index/order">
            <i class="el-icon-document"></i>
            <span slot="title">订单管理</span>
          </el-menu-item>-->

          <!-- <el-menu-item index="/index/shops">
            <i class="el-icon-setting"></i>
            <span slot="title">店铺管理</span>
          </el-menu-item>
          <el-submenu index="account">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>帐号管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/index/accList">帐号列表</el-menu-item>
              <el-menu-item index="/index/accAdd">添加帐号</el-menu-item>
              <el-menu-item index="/index/EdiPwd">修改密码</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="salse">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>销售统计</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/index/shopsStat">商品统计</el-menu-item>
              <el-menu-item index="/index/OrderStat">订单统计</el-menu-item>
            </el-menu-item-group>
          </el-submenu>-->
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data() {
        return {
          // 树菜单列表:
          // index :跳转路由 iclass: 对应图标 title: 对应菜单导航文本  children: 二级菜单
          treeList: [
            { index: "/index/home", iclass: "el-icon-menu", title: "后台首页" },
            {
              index: "/index/order",
              iclass: "el-icon-document",
              title: "订单管理"
            },
            {
              index: "goods",
              iclass: "el-icon-location",
              title: "商品管理",
              children: [
                {
                  index: "/index/goodslist",
                  title: "商品列表"
                },
                {
                  index: "/index/goodsadd",
                  title: "商品添加"
                },
                {
                  index: "/index/goodstype",
                  title: "商品分类"
                }
              ]
            }
          ]
        };
      }
    };
  }
};
</script>

<style lang="less" scoped>
.menu {
  height: 100%;
  a {
    color: white;
  }
  .el-col {
    height: 100%;
    width: 100%;
    .system_name {
      font-size: 18px;
      text-align: center;
      padding: 20px 0 10px 0;
    }
    .el-menu {
      border-right: 0;
    }
  }
}
</style>