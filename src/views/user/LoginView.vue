<template>
  <div class="login-container">
    <img src="@/assets/login/bg.png" alt="" class="wave" />
    <div class="container">
      <div class="img">
        <img src="@/assets/login/img-3.svg" alt="" />
      </div>
      <div class="login-box">
        <form action="">
          <img src="@/assets/login/avatar.svg" alt="" class="avatar" />
          <h2>KUSEAS</h2>
          <div id="username" class="input-group">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <div>
              <h5>账号</h5>
              <input v-model="loginForm.username" tabindex="1" type="text" class="input" />
            </div>
          </div>
          <div id="password" class="input-group">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <div>
              <h5>密码</h5>
              <input v-model="loginForm.password" type="password" tabindex="2" class="input" />
            </div>
          </div>

          <a href="#">忘记密码</a>
          <!-- 提交表单 -->
          <el-button class="btn" :loading="loading" tabindex="3" size="medium" type="primary" @click="handleLogin">
            登录
          </el-button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      passwordType: 'password',
      loginForm: {
        grant_type: 'password',
        username: '',
        password: ''
      }
    }
  },
  mounted() {
    this.addEventHandler()
  },
  methods: {
    shake(elemId) {
      const elem = document.getElementById(elemId)
      if (elem) {
        elem.classList.add('shake')
        setTimeout(() => {
          elem.classList.remove('shake')
        }, 800)
      }
    },
    check() {
      if (this.loginForm.username === '') {
        this.shake('username')
        return false
      }
      if (this.loginForm.password === '') {
        this.shake('password')
        return false
      }
      return true
    },
    addEventHandler() {
      const inputs = document.querySelectorAll('.input')

      function focusFunction() {
        const parentNode = this.parentNode.parentNode
        parentNode.classList.add('focus')
      }
      function blurFunction() {
        const parentNode = this.parentNode.parentNode
        if (this.value === '') {
          parentNode.classList.remove('focus')
        }
      }

      inputs.forEach((input) => {
        input.addEventListener('focus', focusFunction)
        input.addEventListener('blur', blurFunction)
      })
    },
    async handleLogin() {
      if (this.check()) {
        this.loading = true
        const { data: response } = await this.$http.post('login/', this.loginForm) // axios.post返回一个promise ,json
        if (response.code) {
          // 如果code不为0或者undefined，说明失败了
          this.$message.error(response.message)
        } else {
          // code为0或者undefined，说明成功了
          this.$message.success('欢迎')
          window.localStorage.setItem('token', response.access)
          this.$router.push('/home')
        }
        this.loading = false
      }
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    }
  }
}
</script>

<style lang="less" scoped>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
body {
  font-family: 'Roboto', sans-serif;
}

.wave {
  position: fixed;
  height: 100%;
  left: 0;
  bottom: 0;
  z-index: -1;
}
.container {
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 18rem;
  padding: 0 2rem;
}
.img {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.img img {
  width: 500px;
}

.login-box {
  display: flex;
  align-items: center;
  text-align: center;
}
form {
  width: 360px;
}
.avatar {
  width: 100px;
}
form h2 {
  font-size: 2.9rem;
  text-transform: uppercase;
  margin: 15px 0;
  color: #999;
}

.input-group {
  position: relative;
  display: grid;
  grid-template-columns: 7% 93%;
  margin: 25px 0;
  padding: 5px 0;
  border-bottom: 2px solid #d9d9d9;
}

.input-group:nth-child(1) {
  margin-bottom: 4px;
}
.input-group:before,
.input-group:after {
  content: '';
  position: absolute;
  bottom: -2px;
  width: 0;
  height: 2px;
  background-color: #38d39f;
  transition: 0.5s;
}
.input-group:after {
  right: 50%;
}
.input-group:before {
  left: 50%;
}
.icon {
  display: flex;
  justify-content: center;
  align-items: center;
}
.icon i {
  color: #d9d9d9;
  transition: 0.5s;
}

.input-group > div {
  position: relative;
  height: 45px;
}

.input-group > div > h5 {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #d9d9d9;
  font-size: 18px;
  transition: 0.3s;
}
.input-group.focus .icon i {
  color: #38d39f;
}
.input-group.focus div h5 {
  top: -5px;
  font-size: 15px;
}
.input-group.focus:after,
.input-group.focus:before {
  width: 50%;
}
.input {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border: none;
  outline: none;
  background: none;
  padding: 0.5rem 0.7rem;
  font-size: 13px;
  color: #999;
  font-family: 'Roboto', sans-serif;
}
a {
  display: block;
  text-align: right;
  text-decoration: none;
  color: #999;
  font-size: 0.9rem;
  transition: 0.3s;
}
a:hover {
  color: #38d39f;
}
.btn {
  display: block;
  width: 100%;
  height: 50px;
  border-radius: 25px;
  margin: 1rem 0;
  font-size: 1.2rem;
  outline: none;
  border: none;
  background-image: linear-gradient(to right, #32be8f, #38d39f, #32be8f);
  cursor: pointer;
  color: #fff;
  text-transform: uppercase;
  font-family: 'Roboto', sans-serif;
  background-size: 200%;
  transition: 0.5s;
}
.btn:hover {
  background-position: right;
}

.svg-container {
  padding-top: 11px;
  color: #d9d9d9;
  vertical-align: middle;
  display: inline-block;
}

.copyright {
  position: absolute;
  width: 100%;
  height: 50px;
  bottom: 2px;
  color: #38d39f;
  text-align: center;
  font-size: 18px;
  font-family: 'Roboto', sans-serif;
}

.shake {
  animation: shake 800ms ease-in-out;
}
@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%,
  80% {
    transform: translate3d(+2px, 0, 0);
  }
  30%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }
  40%,
  60% {
    transform: translate3d(+4px, 0, 0);
  }
  50% {
    transform: translate3d(-4px, 0, 0);
  }
}

/*媒体查询*/
@media screen and (max-width: 1080px) {
  .container {
    grid-gap: 9rem;
  }
}
@media screen and (max-width: 1024px) {
  form {
    width: 290px;
  }
  form h2 {
    font-size: 2.4rem;
    margin: 8px 0;
  }
  .img img {
    width: 360px;
  }
}
@media screen and (max-width: 768px) {
  .wave {
    display: none;
  }
  .img {
    display: none;
  }
  .container {
    grid-template-columns: 1fr;
  }
  .login-box {
    justify-content: center;
  }
}
</style>
