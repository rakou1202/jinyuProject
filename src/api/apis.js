// 引入axios
import axios from 'axios'

// 设置服务器ip地址
axios.defaults.baseURL = 'http://127.0.0.1:5000/' 

// ====================  验证token是否有效 =========================

export const API_TOKEN = (token)=> axios.get('/users/checktoken', {params:{ token }})


// =============================帐号管理模块 ==========================

// 登录 account:用户名 password:密码
export const Login_API = (account ,password)=> axios.post('users/checkLogin', {account ,password})

// 添加帐号 account 帐号 password:密码 userGroup:帐号分组(超级管理员/普通管理员)
export const add_account = (account ,password,userGroup) => axios.post('users/add', {account ,password,userGroup})

// 获取帐号列表 currentPage: 当前页码  pageSize:每页条数
export const get_accList = (currentPage ,pageSize) => axios.get('/users/list', {params:{currentPage ,pageSize}})

// 删除帐号 参数id 
export const del_acc = (id) => axios.get('/users/del', {params:{ id }})

// 批量删除帐号 参数ids 参数为[1,2,3] 字符串模式
export const del_batch_acc = (ids) => axios.get('/users/batchdel', {params:{ ids }})

// 修改帐号 参数 id  account :帐号  userGroup:用户分组
export const chang_account = (id,account,userGroup ) => axios.post('/users/edit', {id ,account,userGroup})

// 验证旧密码是否正确 参数id 
export const check_oldPwd = (id,oldPwd) => axios.get('/users/checkoldpwd', {params:{ id ,oldPwd }})

// 修改帐号密码 参数 id  newPwd 
export const edit_newPwd = (id,newPwd ) => axios.post('/users/editpwd', { id , newPwd })

// 9. 获取账号（个人中心）信息 id 
export const get_personal = (id) => axios.get('/users/accountinfo', {params:{ id  }})


// ------------------------------------商品管理模块 ---------------------------------

// 获取商品分类列表 currentPage: 当前页码  pageSize:每页条数
export const goods_typeList = (currentPage ,pageSize) => axios.get('/goods/catelist', {params:{currentPage ,pageSize }})

// 添加分类 参数 cateName :分类名称  state :是否启用
export const API_ADD_TYPE = (cateName,state ) => axios.post('/goods/addcate', { cateName , state })

// 删除商品分类
export const del_goodsType = (id) => axios.get('/goods/delcate', {params:{ id }})

// 添加商品 参数 name :商品名 category:商品分类  price:商品价格 imgUrl:商品图片地址 goodsDesc:商品描述
export const API_ADD_GOODS = (name,category , price ,imgUrl, goodsDesc ) => axios.post('/goods/add', { name , category ,price , imgUrl ,goodsDesc  })

// 获取所有商品分类名称
export const API_GET_ALLTYPE = () => axios.get('/goods/categories' )

// 获取商品列表 参数: currentPage 当前页面  pageSize: 每页显示条数
export const API_GOODS_LIST = (currentPage ,pageSize ) => axios.get('/goods/list', {params:{ currentPage , pageSize }})

// 修改商品 参数 id name :商品名 category:商品分类  price:商品价格 imgUrl:商品图片地址 goodsDesc:商品描述
export const API_CHANGE_GOODS = (id , name, category , price ,imgUrl, goodsDesc ) => axios.post('/goods/edit', { id , name , category , price , imgUrl , goodsDesc  })

// 删除商品
export const API_DEL_GOODS = (id) => axios.get('/goods/del', {params:{ id }})


// --------------------------订单管理模块 ---------------------------------------------------

// 获取订单列表 currentPage 当前页面 pageSize 每页显示条数 (必填项目 )  orderNo  订单号 , consignee :收货人 phone :电话 orderState :订单状态  date:时间范围，字符串格类型如: ["2019-10-05 00:00:00","2019-10-10 00:00:00"]
export const API_ORDER_LIST = (currentPage ,pageSize  ,orderNo,consignee,phone, orderState,date) => axios.get('/order/list', {params:{ currentPage , pageSize ,orderNo , consignee,phone, orderState,date}})

// 查询订单列表 参数和获取列表一样
export const API_SEARCH_ORDER = (currentPage ,pageSize  ,orderNo,consignee,phone, orderState,date) => axios.get('/order/search', {params:{ currentPage , pageSize ,orderNo , consignee,phone, orderState,date}})

// 获取订单详情
export const API_ORDER_DETAIL = (id) => axios.get('/order/detail', {params:{ id }})

// 修改订单
export const API_ORDER_CHANGE = (id, orderNo , orderTime,phone ,consignee,deliverAddress,deliveryTime,remarks,orderAmount,orderState) => axios.post('/order/edit', { id ,orderNo ,orderTime,phone, consignee,deliverAddress,deliveryTime,remarks,orderAmount,orderState })


// =========================首页以及报表统计模块 ==========================

// 首页报表接口
export const API_ORDER_TOTAL= () => axios.get('/order/totaldata' )

// 订单报表接口 参数 date : ["2019-10-01 00:00:00", "2019-10-10 00:00:00"] 为字符串数组
export const API_ORDER_SALES_TOTAL = (date) => axios.get('/order/ordertotal', {params:{ date }})