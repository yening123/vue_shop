<template>
  <el-container class="container_box">
    <el-header>
      <div class="left_headerbox">
        <img class="imgs" src="../assets/img/头像1.jpg" alt="" />
        <h3 class="h_font">电商后台管理</h3>
      </div>
      <el-button class="quit_btn" @click="quit">退出</el-button>
    </el-header>

    <el-container>
      <el-aside :width="show_flag === false ? '200px' : '60px'">
        <!-- 展开按钮 -->
        <div class="btn_open" @click="showFn">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <!-- 导航菜单 -->
        <el-menu
          background-color="
          rgb(40,
          47,
          43)"
          text-color="#fff"
          unique-opened
          :collapse="show_flag"
          :collapse-transition="false"
          router
          :default-active="active_path"
        >
          <!-- 一级导航 -->
          <el-submenu
            :index="'/' + item.path"
            v-for="item in menulist"
            :key="item.id"
          >
            <template slot="title"
              ><i :class="iconObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级导航 -->
            <el-menu-item
              :index="'/' + item2.path"
              v-for="item2 in item.children"
              :key="item2.id"
              @click="saveActivePath('/' + item2.path)"
            >
              <i class="el-icon-menu"></i>
              <span>{{ item2.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <!-- 主内容 -->
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script src="../fonts/iconfont.js"></script>
<script>
export default {
  created() {
    this.getMenusList();
    this.active_path = window.sessionStorage.getItem("active_path");
  },
  data() {
    return {
      menulist: [],
      iconObj: {
        125: "iconfont icon-yonghutianchong",
        103: "iconfont icon-quanxianguanli1",
        101: "iconfont icon-gouwuchefill",
        102: "iconfont icon-dingdanguanli",
        145: "iconfont icon-shujutongji",
      },
      show_flag: false,
      active_path: "",
    };
  },
  methods: {
    quit() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    async getMenusList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200)
        return this.$message.error("获取菜单数据失败");
      this.menulist = res.data;
      // console.log(this.menulist);
    },
    showFn() {
      this.show_flag = !this.show_flag;
    },
    saveActivePath(activePath) {
      window.sessionStorage.setItem("active_path", activePath);
    },
  },
};
</script>

<style lang='less'>
.el-main {
  background-image: linear-gradient(
    to right top,
    #195ad4,
    #005fcb,
    #0062c2,
    #0065b7,
    #1667ab,
    #235f99,
    #2a5687,
    #2e4e75,
    #293c5a,
    #212b40,
    #181c28,
    #090a12
  );
}
.el-header {
  display: flex;
  background-color: rgb(40, 47, 43);
  justify-content: space-between;
  align-items: center;
}
.left_headerbox {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
h3 {
  padding-left: 20px;
  color: #fff;
  font-weight: 800;
  font-size: 20px;
}
.imgs {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}

.el-aside {
  background-color: rgba(40, 47, 43);
  .el-menu {
    border: 0px;
  }
}

.container_box {
  height: 100%;
}
i {
  padding-right: 10px;
}

.btn_open {
  width: 100%;
  height: 30px;
  display: flex;
  background-color: rgb(#1c211f);
  justify-content: center;
  align-items: center;
  span {
    width: 7px;
    height: 7px;
    background-color: aquamarine;
    border-radius: 50%;
    margin-right: 3px;
  }
  span:nth-child(1) {
    background-color: rgb(7, 192, 248);
  }
  span:nth-child(2) {
    background-color: rgb(188, 74, 199);
  }
  span:nth-child(3) {
    background-color: rgb(110, 112, 218);
  }
}
.btn_open:hover {
  cursor: pointer;
}
.quit_btn {
  height: 30px;
  width: 70px;
  line-height: 7px !important;
  border-radius: 15px !important;
}

.el-menu-item:hover,
.el-submenu__title:hover {
  background-color: rgb(10, 102, 178) !important;
}
</style>