<template>
  <el-container class="home-container">
    <el-header class="home-header">
      <div class="logo" :class="{showSlide: isCollapse,hideSlide: !isCollapse}">
        <a href="http://www.szbjh.com/index.aspx">
          <img src="../../assets/images/logo.png" alt="logo" />
        </a>
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
            <el-dropdown-item command="updatePassword">修改密码</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>

    <el-container>
      <!-- 左侧导航菜单 -->
      <el-aside
        width="200px"
        class="my-aside"
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
          <el-menu-item index="/eventrecord">
            <i class="el-icon-edit-outline"></i>
            <span slot="title">事件记录</span>
          </el-menu-item>

          <el-menu-item index="/evaluationform">
            <i class="el-icon-document"></i>
            <span slot="title">考核表</span>
          </el-menu-item>

          <el-menu-item index="/evaluationsummaryform">
            <i class="el-icon-document-checked"></i>
            <span slot="title">考核汇总表</span>
          </el-menu-item>

          <el-menu-item index="/targetlibrarymanage" v-if="$store.state.userInfo.level > 2">
            <i class="el-icon-folder-opened"></i>
            <span slot="title">指标库管理</span>
          </el-menu-item>

          <el-menu-item index="/usermanagement" v-if="$store.state.userInfo.level > 2">
            <i class="el-icon-user"></i>
            <span slot="title">用户管理</span>
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

    <el-dialog title="修改密码" :visible.sync="updateDialogVisible" width="30%">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input type="password" v-model="form.oldPassword" placeholder="请输入旧密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input type="password" v-model="form.password" placeholder="请输入新密码"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="changePassword">确 定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import { apiChangePassword } from "../../api/user";

export default {
  name: "Home",
  data() {
    return {
      updateDialogVisible: false,
      form: {
        accounts: this.$store.state.userInfo.accounts,
        oldPassword: "",
        password: ""
      },
      rules: {
        oldPassword: [
          { required: true, message: "请输入旧密码", trigger: "blur" },
          { min: 3, max: 18, message: "长度在 3 到 18 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          { min: 3, max: 18, message: "长度在 3 到 18 个字符", trigger: "blur" }
        ]
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
      if (cmd == "updatePassword") {
        this.updateDialogVisible = true;
      } else if (cmd == "logout") {
        // 删除登录后的信息
        window.sessionStorage.removeItem("userInfo");
        window.sessionStorage.removeItem("fpmtoken");
        this.$router.push("/login");
      }
    },
    changePassword() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          this.$confirm(`确定修改吗？`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(async () => {
              try {
                let res = await apiChangePassword(this.form);
                if (res.data.errorCode === 0) {
                  this.$message.success("密码修改成功, 请重新登录！");
                  this.updateDialogVisible = false;
                  this.$router.push("/otherlogin");
                } else {
                  this.$message.error(res.data.errorMessage);
                }
              } catch (error) {
                console.log(error);
                this.$message.success("密码修改失败");
              }
            })
            .catch(() => {});
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.home-container {
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

  .home-header {
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

  .my-aside {
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

  .my-main {
    background-color: #fff;
    padding: 0;
  }

  .right_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
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