<template>
  <div class="login_container">
    <div class="formBox">
      <div class="left"></div>
      <!-- 表单绑定 -->
      <el-form
        :model="loginForm"
        ref="loginFormRef"
        :rules="loginFormRules"
        class="right"
      >
        <div class="right_con">
          <h1>心悦家电后台管理</h1>
          <h3 class="name">NAME</h3>
          <el-form-item prop="username">
            <el-input class="text" type="text" v-model="loginForm.username" />
          </el-form-item>
          <h3 prop="password" class="pwd">PASSWORD</h3>

          <el-form-item prop="password">
            <el-input
              class="text"
              type="password"
              v-model="loginForm.password"
            />
          </el-form-item>
          <div class="btnbox">
            <el-button class="btn" :style="{ color: '#fff' }" @click="loginFn"
              >LOGIN</el-button
            >
            <el-button
              class="rsbtn"
              @click="resetLoginForm"
              :style="{ color: '#fff' }"
              >RESET</el-button
            >
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456",
      },
      loginFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 1, max: 6, message: "长度1到6个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "change" },
        ],
      },
    };
  },
  methods: {
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },

    loginFn() {
      //预验证
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return;

        const { data: res } = await this.$http.post("login", this.loginForm);
        if (res.meta.status !== 200)
          return this.$message({
            customClass: "focus-message err",
            message: "登录失败",
            type: "error",
          });
        this.$message({
          customClass: "focus-message",
          message: "登录成功",
          type: "success",
        });
        window.sessionStorage.setItem("token", res.data.token);
        this.$router.push("/home");
      });
    },
  },
};
</script>

<style lang='less'>
.text input.el-input__inner {
  width: 100%;
  outline: none;
  border: 1px solid #4B678C;
  font-size: 14px;
  color: #4B678C;
  background-color: rgba(0, 0, 0, 0);
  text-align: center;
  border-radius: 20px;
  box-shadow: 0 0 10px #4B678C;
}

.focus-message {
  //消息框
  background-image: linear-gradient(
    to right,
    #1a4c96,
    #4b5f9e,
    #6b74a5,
    #878aad,
    #a1a1b5
  ) !important;
  // font-size: 14px !important;
  border-radius: 10px !important;
  justify-content: center !important;
  border: 0px !important;

  .el-icon-success:before {
    color: rgba(91, 183, 215) !important;
  }
  .el-message__content {
    font-size: 14px !important;
    color: #fff !important;
  }
}

.err {
  background-image: linear-gradient(
    to right,
    #62525c,
    #815b6c,
    #a36276,
    #c56a7a,
    #e57378
  ) !important;
  .el-icon-error:before {
    color: rgb(241, 21, 6) !important;
  }
}
</style>




<style lang="less" scoped>
.login_container {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background-image: radial-gradient(
    circle,
    #2742c0,
    #22389a,
    #1f2e76,
    #1c2353,
    #171932
  );
}
.formBox {
  display: flex;
  width: 900px;
  height: 560px;
  border-radius: 15px;
  overflow: hidden;
}

.left {
  width: 500px;
  height: 560px;
  background: url("../assets/img/ailisi.jpg") no-repeat;
  background-position: -220px;
}

.right {
  display: flex;
  width: 400px;
  height: 560px;
  justify-content: center;
  background-color: aliceblue;
}

.right_con {
  width: 70%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

h1 {
  font-size: 26px;
  font-weight: 400;
  padding-bottom: 20px;
  color: #4B678C;
}

h3 {
  font-size: 12px;
  padding-top: 10px;
  color: #4B678C;
  font-weight: 400;
  padding-left: 0px;
}

// .el-input /deep/ .el-input__inner {
//   width: 100%;
//   outline: none;
//   border: none;
//   border-bottom: 1px solid #4B678C;
//   font-size: 14px;
//   color: #4B678C;
//   background-color: rgba(0, 0, 0, 0);
//   text-align: center;
// }
.btnbox {
  display: flex;
  width: 100%;
  justify-content: center;
  margin-top: 30px;
}

.btn,
.rsbtn {
  width: 100px;
  background-image: linear-gradient(
    to right,
    #1a4c96,
    #4b5f9e,
    #6b74a5,
    #878aad,
    #a1a1b5
  );
  background-size: 200%;
  transition: background-position 1s;
  border: none;
  border-radius: 20px;
  height: 40px;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
}
.rsbtn {
  background-image: linear-gradient(
    to right top,
    #3c76b5,
    #3f98c9,
    #5cb8d7,
    #86d8e2,
    #b6f6f0
  );
}
.rsbtn:hover,
.btn:hover {
  color: #fff;
  background-position: 100% 0;
}
</style>