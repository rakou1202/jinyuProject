import VueRouter from 'vue-router'
import Vue from 'vue'

import Login from '../pages/Login'

import {API_TOKEN} from '../api/apis'

Vue.use(VueRouter)

const router =  new VueRouter({
    routes: [{
        path: '/',
        name: '',
        component: Login , 
        meta:{role: ['super' , 'normal']}
    }, {
        path: '/index',
        name: 'index',
        component: () => import('../pages/Index'),
        meta: {role : ['super' , 'normal']},
        children: [{
            path: '/index/home',         //首页
            name: 'home',
            component: () => import('../pages/home/Home'),
            meta: {role : ['super' , 'normal']}
        },{
            path: '/index/order',    //订单管理
            name: 'order',
            component: () => import('../pages/order/Order'),
            meta: {role : ['super' , 'normal']}
        },{
            path: '/index/goodsadd',   //添加商品
            name: 'goodsadd',
            component: () => import('../pages/goods/Add'),
            meta: {role : ['super' , 'normal']}
        },{
            path: '/index/goodslist',  // 商品列表
            name: 'goodslist',
            component: () => import('../pages/goods/List'),
            meta: {role : ['super' , 'normal']}
        },{
            path: '/index/goodstype',  // 商品类型
            name: 'goodstype',
            component: () => import('../pages/goods/Type'),
            meta: {role : ['super' , 'normal']}
        },{
            path: '/index/shops',    //店铺管理
            name: 'shops',
            component: () => import('../pages/shops/Shops'),
            meta: {role : ['super' ]}
        },{
            path: '/index/accAdd',       // 添加帐号
            name: 'accAdd',
            component: () => import('../pages/account/Add'),
            meta: {role : ['super' ]}
        },{
            path: '/index/accList',    // 帐号列表
            name: 'accList',
            component: () => import('../pages/account/List'),
            meta: {role : ['super']}
        },{
            path: '/index/EdiPwd',         // 修改密码
            name: 'accAdd',
            component: () => import('../pages/account/EdiPwd'),
            meta: {role : ['super']}
        },{
            path: '/index/shopsStat',   // 商品统计
            name: 'shopStat',
            component: () => import('../pages/sales/ShopsStat'),
            meta: {role : ['super' ]}
        },{
            path: '/index/orderStat',   //订单统计
            name: 'shopStat',
            component: () => import('../pages/sales/OrderStat'),
            meta: {role : ['super' ]}
        },{
            path: '/index/personal',    // 个人中心
            name: 'personal',
            component: () => import('../pages/personal/Personal'),
            meta: {role : ['super' , 'normal']}
        }]
    }
    ]
})

// 路由守卫 
router.beforeEach((to  , from, next)=>{

      // 如果当前页面不再登录页面 需进行判断
      if(to.path != '/'){
        // 发送请求 验证token是否有效
        API_TOKEN(localStorage.token).then(res=>{
            if(res.data.code == 0 ){ //token有效 还在登录状态
            
         
                if( to.meta.role.includes(localStorage.role)){  //判断即将跳转的路由对象中meta属性role数组是否包含
                    next() //放行
                    }else{
                    next(from.path) //停留在当前页面
                    }


            }else{ //token无效返回登录页面
                next('/')
            }
        })
    }else{  //在登陆页面执行下一步
        next()
    }
})

export default router 