<template>
    <div class="header">
            <ul class="navbar">
                <li><a href="">首页 &emsp;&gt;</a></li>
                <li><a href="">帐号管理 &emsp;&gt;</a></li>
            </ul>
        <div class="head_img">
           <div>欢迎你,<span>小貂禅</span></div>
           <router-link class="img_box" to="/index/personal"><img src="../../assets/imgs/propic.jpg" alt="" ></router-link>
        </div>
    </div>
</template>

<script>
    export default {
        
    }
</script>

<style lang="less" scoped>
.header{
    width: 100%;
    display: flex ;
    justify-content: space-between ; 
    background: white;
    padding: 10px;
    .navbar{
        display: flex ;
        list-style: none;
        li{
            margin-right: 20px;
            line-height: 50px;
            &:first-child{
                font-weight: bold;
            }
            a{
                color: #000;
                text-decoration: none;
            }
        }
    }
    .head_img{
        display: flex;
        align-items: center;
        .img_box{
            width: 50px;
            height: 50px;
            border-radius: 50%;
            overflow: hidden;
            margin: 0 20px;
            img{
                width: 100%;
            }
        }

    }
}
</style>