<template>
  <el-container>
    <el-aside :width="isCollapse ? '64px' : '240px'">
      <div class="title">
        <span>kuseas管理平台</span>
      </div>
      <el-menu
        router
        default-active="101"
        background-color="#123"
        text-color="#fff"
        active-text-color="#ffd04b"
        :collapse="isCollapse"
      >
        <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id" >
          <template slot="title">
            <i class="el-icon-menu"></i>
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
          <el-button type="primary" @click="logout">退出</el-button>
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
  },
  data() {
    return {
      menuList: [],
      isCollapse: false
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
    font-size: 16px;
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
