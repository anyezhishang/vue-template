<template>
  <el-container class="home_container">
    <el-header class="home_header">
      <div class="logo" :class="{showSlide: isCollapse,hideSlide: !isCollapse}">
        <img src="../../assets/images/logo.png" alt="logo" />
      </div>
      <div class="header_center">
        <i :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'" @click="changeCollapse"></i>
      </div>
      <div class="header_right">
        <el-dropdown trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            欢迎您！ {{ $store.state.userInfo.name }}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>

          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>

    <el-container>
      <!-- 左侧导航菜单 -->
      <el-aside
        width="200px"
        class="my_aside"
        :class="{asideShowSlide: isCollapse,asideHideSlide: !isCollapse}"
      >
        <el-menu
          router
          unique-opened
          style="width:100%"
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          :class="{asidePadding: isCollapse}"
          background-color="#fff"
          text-color="#9a9a9a"
          active-text-color="#575962"
        >
          <el-menu-item :index="$router.options.routes[3].children[1].path">
            <i class="el-icon-edit-outline"></i>
            <span slot="title">{{ $router.options.routes[3].children[1].meta.title }}</span>
          </el-menu-item>

          <el-menu-item :index="$router.options.routes[3].children[2].path">
            <i class="el-icon-document"></i>
            <span slot="title">{{ $router.options.routes[3].children[2].meta.title }}</span>
          </el-menu-item>

          <el-menu-item :index="$router.options.routes[3].children[3].path">
            <i class="el-icon-document-checked"></i>
            <span slot="title">{{ $router.options.routes[3].children[3].meta.title }}</span>
          </el-menu-item>

          <el-menu-item :index="$router.options.routes[3].children[4].path">
            <i class="el-icon-folder-opened"></i>
            <span slot="title">{{ $router.options.routes[3].children[4].meta.title }}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-container>
        <!-- 右边主体 -->
        <el-main class="right_main">
          <!-- 右下部分的子路由出口 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      form: {
        accounts: this.$store.state.userInfo.accounts,
        oldPassword: "",
        password: ""
      },

      isCollapse: false
    };
  },
  methods: {
    changeCollapse() {
      this.isCollapse = !this.isCollapse;
    },

    // 顶部下拉菜单下拉项的点击事件
    handleCommand(cmd) {
      // console.log(cmd);
      if (cmd == "logout") {
        // 删除登录后的信息
        window.sessionStorage.removeItem("userInfo");
        window.sessionStorage.removeItem("fpmtoken");
        this.$router.push("/login");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.home_container {
  height: 100%;

  // logo的收缩展开动画
  .showSlide {
    animation: slideInLeft 0.5s forwards;
  }

  .hideSlide {
    animation: slideOutLeft 0.5s forwards;
  }

  @keyframes slideInLeft {
    from {
      width: 200px;
      margin-left: 0;
    }
    to {
      width: 30px;
      margin-left: 10px;
    }
  }

  @keyframes slideOutLeft {
    from {
      width: 30px;
      margin-left: 10px;
    }
    to {
      width: 200px;
      margin-left: 0;
    }
  }

  .home_header {
    background-color: #716aca;
    color: #fff;
    height: 80px;
    padding: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .logo {
      width: 200px;
      text-align: center;
      overflow: hidden;

      img {
        max-width: 100px;
        max-height: 30px;
        width: auto;
        height: auto;
      }
    }

    .header_center {
      flex: 1;

      i {
        font-size: 20px;
        line-height: 80px;
        padding: 0 15px;
        cursor: pointer;

        &:hover {
          background-color: #7160ca;
        }
      }
    }

    .header_right {
      margin-right: 20px;

      .el-dropdown {
        color: #fff;
        cursor: pointer;
      }
    }
  }

  .my_aside {
    overflow: hidden;
    background-color: #fff;

    .el-menu-item {
      border-radius: 30px !important;
      height: 46px;
      line-height: 46px;
      margin: 5px 0;
    }
    .el-menu-item i {
      color: #9a9a9a;
    }
    .el-menu-item:hover {
      background: rgba(0, 0, 0, 0.03) !important;
      border-radius: 30px !important;
    }
    .el-menu-item.is-active {
      color: #575962;
      font-weight: 600;
      background: rgba(0, 0, 0, 0.05) !important;
    }
    .el-menu-item.is-active i {
      color: #4d7cfe;
    }

    // aside收缩时改变导航项padding
    .el-menu.asidePadding .el-menu-item {
      padding-left: 8px !important;
      padding-right: 10px !important;
    }
    .el-menu.asidePadding .el-menu-item [class^="el-icon-"] {
      margin-right: 8px;
    }
  }

  // 导航栏的收缩展开动画
  .asideShowSlide {
    animation: asideSlideInLeft 0.5s forwards;
  }

  .asideHideSlide {
    animation: asideSlideOutLeft 0.5s forwards;
  }

  @keyframes asideSlideInLeft {
    from {
      width: 200px;
    }
    to {
      width: 40px;
    }
  }

  @keyframes asideSlideOutLeft {
    from {
      width: 40px;
    }
    to {
      width: 200px;
    }
  }

  .right_main {
    background-color: #efefef;
  }
}
</style>

<style lang="scss">
.el-menu-item,
.el-submenu__title {
  border-radius: 30px;
  height: 46px !important;
  line-height: 46px !important;
  margin: 5px 0;
}
.el-submenu__title:hover {
  background: rgba(0, 0, 0, 0.03) !important;
  border-radius: 30px;
}

.el-submenu__title i {
  color: #9a9a9a !important;
}
</style>