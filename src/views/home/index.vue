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
        <el-dropdown trigger="click" placement="bottom" @command="handleCommand">
          <span class="el-dropdown-link">
            欢迎您！ {{ $store.state.userInfo[0].name }}
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
        class="my_aside"
        :class="{ asideShowSlide: isCollapse,asideHideSlide: !isCollapse }"
        width="200px"
      >
        <el-menu
          class="el-menu-vertical-demo"
          :class="{ asidePadding: isCollapse }"
          router
          unique-opened
          :default-active="$route.path"
          :default-openeds="defaultOpenedsArray"
          :text-color="colorIconIsActive"
          :active-text-color="bgColorHeader"
          background-color="#fff"
          style="width:100%"
        >
          <!-- <el-menu-item :index="$router.options.routes[3].children[1].path">
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
          </el-menu-item>-->

          <el-menu-item v-for="(item, index) in menuArr" :key="index" :index="item.path">
            <i :class="menuIconArr[index]"></i>
            <span slot="title">{{ item.meta.title }}</span>
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
import {
  bgColorHeader,
  colorIconIsActive
} from "../../assets/sass/variable.scss";

export default {
  name: "Home",
  data() {
    return {
      form: {
        accounts: this.$store.state.userInfo.accounts,
        oldPassword: "",
        password: ""
      },

      menuIconArr: [
        "el-icon-edit-outline",
        "el-icon-document",
        "el-icon-document-checked",
        "el-icon-folder-opened"
      ],

      defaultOpenedsArray: [],
      isCollapse: false,

      bgColorHeader,
      colorIconIsActive
    };
  },
  computed: {
    // 去掉第一个重定向的页面
    menuArr() {
      return this.$router.options.routes[3].children.filter((item, index) => {
        return index !== 0;
      });
    }
  },
  methods: {
    changeCollapse() {
      this.isCollapse = !this.isCollapse;
      // 控制收起所有子菜单
      this.defaultOpenedsArray = [];
    },

    // 顶部下拉菜单下拉项的点击事件
    handleCommand(cmd) {
      // console.log(cmd);
      if (cmd == "logout") {
        // 删除登录后的信息
        window.sessionStorage.removeItem("userInfo");
        window.sessionStorage.removeItem("token");
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
    background-color: $bg-color-header;
    color: #fff;
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
        line-height: 60px;
        padding: 0 15px;
        cursor: pointer;

        &:hover {
          background-color: $color-collapse-hover;
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
      // sass全局变量
      color: $color-icon-isactive;
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
      color: $bg-color-header;
    }

    // aside收缩时改变无子菜单的导航项padding
    .el-menu.asidePadding .el-menu-item {
      padding-left: 8px !important;
      padding-right: 10px !important;
    }
    .el-menu.asidePadding .el-menu-item [class^="el-icon-"] {
      margin-right: 8px;
    }

    // aside收缩时改变有子菜单的导航项padding
    ::v-deep .el-menu.asidePadding .el-submenu .el-submenu__title {
      padding-left: 8px !important;
      padding-right: 10px !important;
    }
    ::v-deep .el-menu.asidePadding .el-submenu [class^="el-icon-"] {
      margin-right: 8px;
    }
    ::v-deep .el-menu.asidePadding .el-submenu .el-submenu__icon-arrow {
      right: inherit;
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
  // sass全局变量
  color: $color-icon-isactive !important;
}
</style>