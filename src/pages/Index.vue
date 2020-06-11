<template>
  <el-container class="index">
    <!-- 左边侧栏 -->
    <el-aside width="200px" class="menu">
      <el-col :span="12">
        <h5 class="system_name">
          <i class="el-icon-s-platform"></i>
          正黄管理中心
        </h5>
        <!-- 导航栏开始 -->
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          background-color="#304156"
          text-color="#fff"
          active-text-color="#ffd04b"
          router
          unique-opened
        >
          <!-- 动态循环导航栏中的树菜单数据 使用div嵌套循环 -->
          <div v-for="item of newtreeList" :key="item.index">
            <!-- 二级菜单 -->
            <el-submenu v-if="item.children" :index="item.index">
              <template slot="title">
                <i :class="item.iclass"></i>
                <span>{{item.title}}</span>
              </template>
              <!-- 二级子菜单  在此进行二级菜单item.child 的循环-->
              <el-menu-item-group v-for="child of item.children" :key="child.index">
                <el-menu-item :index="child.index">{{child.title}}</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <!-- 一级菜单 -->
            <el-menu-item v-else :index="item.index">
              <i :class="item.iclass"></i>
              <span slot="title">{{item.title}}</span>
            </el-menu-item>
          </div>
        </el-menu>
      </el-col>
    </el-aside>
    <!-- 右边 -->
    <el-container class="right">
      <!-- 头部 -->
      <el-header class="head">
        <!-- 左侧面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item v-for="(item,index) of breadList" :key="index">{{item}}</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 右侧个人中心头像 -->
        <div class="head_img">
          <!-- 下拉菜单 -->
          <el-dropdown :hide-on-click="true">
            <!-- 动态获取用户名 -->
            <span class="el-dropdown-link" v-html="accName"></span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <a href="#/index/personal" class="personal">个人中心</a>
              </el-dropdown-item>
              <el-dropdown-item divided>
                <span @click="logout">退出</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <router-link class="img_box" to>
            <img :src="headimg" alt />
          </router-link>
        </div>
      </el-header>
      <!-- 右边主要内容区域 -->
      <el-main>
        <router-view class="dynamic_board"></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// 引入api 模块
import { API_TOKEN, get_personal } from "../api/apis";

export default {
  data() {
    return {
      // 左侧树菜单动态数据
      // index：路径 iclass 图标类名 title： 菜单栏名称
      // children：子菜单选项  title 二级菜单路由 index: 二级菜单路由地址
      treeList: [
        {
          index: "/index/home",
          iclass: "el-icon-house",
          title: "后台首页",
          role: ["super", "normal"]
        },
        {
          index: "/index/order",
          iclass: "el-icon-document",
          title: "订单管理",
          role: ["super", "normal"]
        },
        {
          index: "goods",
          iclass: "el-icon-s-goods",
          title: "商品管理",
          role: ["super", "normal"],
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
        },
        {
          index: "/index/shops",
          iclass: "el-icon-s-shop",
          title: "店铺管理",
          role: ["super"]
        },
        {
          index: "account",
          iclass: "el-icon-user",
          title: "帐号管理",
          role: ["super"],
          children: [
            {
              index: "/index/accList",
              title: "帐号列表"
            },
            {
              index: "/index/accAdd",
              title: "添加帐号"
            },
            {
              index: "/index/EdiPwd",
              title: "修改密码"
            }
          ]
        },
        {
          index: "salse",
          iclass: "el-icon-receiving",
          title: "销售统计",
          role: ["super"],
          children: [
            {
              index: "/index/shopsStat",
              title: "商品统计"
            },
            {
              index: "/index/OrderStat",
              title: "订单统计"
            }
          ]
        }
      ],

      breadList: [], // 头部面包屑导航
      accName: "", //头部动态渲染帐号名
      role: "", //登录时候的权限
      headimg: "" //头像图片
    };
  },
  methods: {
    // 监听路由hash值 改变头部面包屑动态数组
    hashchange(val) {
      let arr = [];
      switch (val.path) {
        case "/index/home":
          arr = ["首页"];
          break;
        case "/index/order":
          arr = ["订单管理"];
          break;
        case "/index/goodsadd":
          arr = ["商品管理", "商品添加"];
          break;
        case "/index/goodslist":
          arr = ["商品管理", "商品列表"];
          break;
        case "/index/goodstype":
          arr = ["商品管理", "商品类型"];
          break;
        case "/index/shops":
          arr = ["店铺管理"];
          break;
        case "/index/accAdd":
          arr = ["帐号管理", "添加帐号"];
          break;
        case "/index/accList":
          arr = ["帐号管理", "帐号列表"];
          break;
        case "/index/EdiPwd":
          arr = ["帐号管理", "修改密码"];
          break;
        case "/index/shopsStat":
          arr = ["销售统计", "商品统计"];
          break;
        case "/index/OrderStat":
          arr = ["销售统计", "订单统计"];
          break;
        case "/index/personal":
          arr = ["个人中心"];
          break;
      }
      this.breadList = arr;
    },

    // 点击退出 移除本地存储token
    logout() {
      localStorage.removeItem("token"); //移除本地存储token
      this.$router.push("/");
    }
  },

  // 监听hash路由或数据的变化
  watch: {
    $route: {
      //监听路由对象的变化
      handler: val => {
        //val为变化后的路由对象 另一个形参是跳转前的路由对象
        window.pathVal = val.path;
        window.that.hashchange(val); //调用当前组件下的方法
      }
    }
  },

  created() {
    window.that = this; //保存this指向
    this.hashchange(this.$route); //监听hash

    // 发送请求 验证token是否有效
    API_TOKEN(localStorage.token).then(res => {
      if (res.data.code == 0) {
        //验证token有效
        // 显示用户名
        this.accName =
          "欢迎你 , " +
          localStorage.username +
          '<i class="el-icon-arrow-down el-icon--right"></i>';
      } else {
        //token过期 显示请登录
        this.accName = '<a href="#/" class="login_link">亲 , 请登录</a>';
      }
    });

    // 一进入页面将登陆时候保存的权限role保存到data中
    this.role = localStorage.role;

    // 一进入页面 发送请求 获取个人中心头像
    get_personal(localStorage.id).then(res => {
      this.headimg = res.data.accountInfo.imgUrl; //渲染到页面
    });
  },

  computed: {
    // 过滤树菜单treeList 返回一个新数组 分配权限
    newtreeList() {
      return this.treeList.filter(item => item.role.includes(this.role));
    }
  }
};
</script>

<style lang="less" scoped>
a {
  color: #000;
  text-decoration: none;
}
.index {
  display: flex;
  width: 100%;
  height: 100%;
  .menu {
    width: 100%;
    height: 100%;
    background: rgb(48, 65, 86);
    color: white;
    h5 {
      i {
        color: #5cb6ff;
      }
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
  .right {
    flex: 1;
    width: 100%;
    .head {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .el-breadcrumb,
      .el-breadcrumb__item {
        font-size: 18px;
      }
      .head_img {
        display: flex;
        align-items: center;
        .el-dropdown-link {
          cursor: pointer;
          color: #409eff;
        }
        .el-icon-arrow-down {
          font-size: 12px;
        }
        .img_box {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          overflow: hidden;
          margin: 0 20px;
          font-size: 16px;
          img {
            width: 100%;
          }
        }
      }
    }
    .el-main {
      width: 100%;
      background: rgb(240, 242, 245);
      .dynamic_board{
        width: 100%;
      }
    }
  }
}
</style>