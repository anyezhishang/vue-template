<template>
  <div class="login">
    <el-form class="login_form" :rules="rules" ref="form" :model="ruleForm">
      <el-form-item class="form_item">
        <div class="login_form_welcome">您好！欢迎来到百佳华管理平台</div>
      </el-form-item>
      <el-form-item class="form_item" prop="account">
        <i class="iconfont icon-yonghu"></i>
        <el-input class="form_input" placeholder="帐号" v-model="ruleForm.account"></el-input>
      </el-form-item>
      <el-form-item class="form_item" prop="password">
        <i class="iconfont icon-mima"></i>
        <el-input class="form_input" type="password" placeholder="密码" v-model="ruleForm.password"></el-input>
      </el-form-item>
      <el-form-item class="form_item">
        <el-button class="login_btn" type="primary" @click="handleLogin">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { apiUserLogin } from "../../api/user";

export default {
  name: "Login",
  data() {
    return {
      ruleForm: {
        account: process.env.VUE_APP_FLAG !== "production" ? "1" : "",
        password: process.env.VUE_APP_FLAG !== "production" ? "1" : ""
      },
      rules: {
        account: [{ required: true, message: "请输入帐号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  created() {
    this.setEnterEvent();
  },
  destroyed() {
    document.onkeyup = null;
  },
  methods: {
    // 设置回车登录事件
    setEnterEvent() {
      document.onkeyup = e => {
        e = window.event || e;
        if (e.keyCode == 13 || e.key == "Enter") {
          this.handleLogin();
        }
      };
    },
    handleLogin() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          try {
            let res = await apiUserLogin(this.ruleForm);
            console.log(res);
            if (res.data.errorCode === 0) {
              this.$store.commit("changeUserInfo", res.data.data.userInfo);
              window.sessionStorage.setItem("token", res.data.data.token);
              this.$message.success("登录成功");

              // 跳转到首页
              if (this.$route.name === "Login") {
                this.$router.push("/home");
              } else {
                this.$router.back();
              }
            } else {
              this.$message.error("帐号或密码错误");
            }
          } catch (error) {
            console.log(error);
            //提示用户名或密码错误
            this.$message.error("帐号或密码错误");
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.login {
  background: url("../../assets/images/login_bg.jpg") no-repeat center;
  background-size: 100% 100%;
  height: 100%;

  .login_form {
    box-sizing: border-box;
    position: absolute;
    left: 10%;
    top: 50%;
    margin-top: -216px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    height: 432px;
    width: 24%;
    border-radius: 20px;

    background-color: #fff;

    .form_item {
      width: 73%;
    }

    .login_form_welcome {
      position: relative;
      text-align: left;
      font-size: 22px;

      &::before {
        content: "";
        position: absolute;
        width: 60px;
        height: 2px;
        background: #018cfe;
        bottom: -12px;
      }
    }

    .el-form-item {
      position: relative;
      text-align: center;
      margin-bottom: 20px;

      &:first-child {
        margin-bottom: 45px;
      }

      ::v-deep .el-input__inner {
        padding-left: 55px;
        border: none;
        background-color: #f7f7f7;
      }

      .iconfont {
        position: absolute;
        left: 18px;
        z-index: 10000;
        color: #d2d2d2;
        font-size: 24px;
      }

      .login_btn {
        width: 100%;
        height: 46px;
        font-size: 18px;
        background-color: #6916fd;
        border: none;
        border-radius: 18px;
        color: #ffffff;
        margin-top: 8px;
      }
    }
  }
}
</style>