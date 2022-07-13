<template>
  <el-container>
    <el-aside :width="isCollapse ? '64px' : '240px'">
      <div class="title">
        <svg-icon icon-class="title" />
      </div>
      <el-menu
        router
        default-active="101"
        background-color="#123"
        text-color="#fff"
        active-text-color="#ffd04b"
        :collapse="isCollapse"
        :collapse-transition="false"
      >
        <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
          <template slot="title">
            <svg-icon icon-class="users" />
            <span>{{ item.name }}</span>
          </template>
          <el-menu-item :index="sub.path" v-for="sub in item.children" :key="sub.id">
            {{ sub.name }}
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div>
          <i :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'" @click="isCollapse = !isCollapse"></i>
        </div>
        <div class="info">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link"> {{ user.username }}</span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="chpwd"><svg-icon icon-class="editpwd" /> 修改密码</el-dropdown-item>
              <el-dropdown-item divided command="logout"><svg-icon icon-class="exit" /> 退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!-- 修改密码 -->
          <el-dialog :title="`修改 ${user.username} 密码`" :visible.sync="chpwdDialogVisible" width="38%">
            <el-form :model="chpwdForm" :rules="chpwdRules" ref="chpwd" label-width="100px">
              <el-form-item label="旧密码" prop="oldPassword">
                <el-input type="password" show-password v-model="chpwdForm.oldPassword"></el-input>
              </el-form-item>
              <el-form-item label="新密码" prop="password">
                <el-input type="password" show-password v-model="chpwdForm.password"></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="checkPass">
                <el-input type="password" show-password v-model="chpwdForm.checkPass"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="chpwdDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="chpwd">确 定</el-button>
            </span>
          </el-dialog>
        </div>
      </el-header>
      <el-main>
        <!-- 嵌套路由 呈现 子组件的地方 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created() {
    this.getMenuList()
    this.getUserInfo()
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value !== this.chpwdForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      menuList: [],
      isCollapse: false,
      user: {},
      // 修改密码
      chpwdDialogVisible: false,
      chpwdForm: {
        oldPassword: '',
        password: '',
        checkPass: ''
      },
      chpwdRules: {
        oldPassword: [
          { required: true, message: '请输入旧密码', trigger: 'blur' },
          { min: 4, max: 16, message: '长度在 4 到 16 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 4, max: 16, message: '长度在 4 到 16 个字符', trigger: 'blur' }
        ],
        checkPass: [
          { required: true, message: '二次确认新密码', trigger: 'blur' },
          { min: 4, max: 16, message: '长度在 4 到 16 个字符', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    logout() {
      window.localStorage.removeItem('token')
      this.$router.push('/login')
    },
    async getMenuList() {
      const { data: response } = await this.$http.get('users/menulist/')
      this.menuList = response
    },
    async getUserInfo() {
      const { data: response } = await this.$http.get('users/whoami/')
      if (response.code) {
        return this.$message.error(response.message)
      }
      this.user = response.user
    },
    handleCommand(command) {
      if (command === 'logout') {
        this.logout()
      } else if (command === 'chpwd') {
        this.chpwdDialogVisible = true
      }
    },
    chpwd() {
      const name = 'chpwd'
      this.$refs[name].validate(async (valid) => {
        if (valid) {
          console.log(this.chpwdForm)
          const { data: response } = await this.$http.patch(`users/${this.user.id}/setpwd/`, this.chpwdForm)
          if (response.code) {
            return this.$message.error(response.message)
          }
          this.$message.success('密码修改成功')
          this.chpwdDialogVisible = false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 5px;
  i {
    font-size: 25px;
    margin-left: 5px;
  }
}
.el-aside {
  background-color: #041527;
  .title {
    color: #ffffff;
    font-size: 32px;
    text-align: center;
    height: 60px;
  }
}

.el-main {
  background-color: #f0f2f4;
}
.el-menu {
  border-right: none;
}
</style>
