<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="5">
          <el-input placeholder="请输入内容" v-model="input3">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="dataList" style="width: 100%">
        <el-table-column prop="id" label="ID"> </el-table-column>
        <el-table-column prop="username" label="用户名"> </el-table-column>
        <el-table-column prop="is_superuser" label="管理员"> </el-table-column>
        <el-table-column prop="is_active" label="激活"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="phone" label="电话"> </el-table-column>
      </el-table>
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="pagination.page"
        :page-size="pagination.size"
        layout="total, prev, pager, next, jumper"
        :total="pagination.total"
      >
      </el-pagination>
    </el-card>
    <!-- 新增 -->
    <el-dialog title="提示" :visible.sync="addDialogVisible" width="38%" @close="resetForm('add')">
      <!-- <el-dialog title="提示" :visible.sync="addDialogVisible" width="80%" @close="$refs['add'].resetFields()"> -->
      <el-form :model="addForm" :rules="addRules" ref="add" label-width="100px">
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" show-password v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" show-password v-model="addForm.checkPass"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="addForm.phone"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getList()
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value !== this.addForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      input3: '',
      addDialogVisible: false,
      dataList: [],
      // 分页数据
      pagination: { total: 0, page: 1, size: 20 },
      addForm: {
        username: '',
        password: '',
        checkPass: '',
        email: '',
        phone: ''
      },
      addRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 4, max: 16, message: '长度在 4 到 16 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 4, max: 16, message: '长度在 4 到 16 个字符', trigger: 'blur' }
        ],
        checkPass: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { min: 4, max: 16, message: '长度在 4 到 16 个字符', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.getList(val)
    },
    resetForm(name) {
      this.$refs[name].resetFields()
    },
    add() {
      const name = 'add'
      this.$refs[name].validate(async (valid) => {
        if (valid) {
          // 检验成功
          const { data: response } = await this.$http.post('users/', this.addForm)
          if (response.code) {
            return this.$message.error(response.message)
          }
          this.addDialogVisible = false // @close 触发
          // 显示用户列表，从后台拿回数据
          this.getList()
        }
      })
    },
    async getList(page) {
      if (!page) {
        page = 1
      }
      const { data: response } = await this.$http.get(`users/?page=${page}`) // mix list
      if (response.code) {
        return this.$message.error(response.message)
      }
      this.pagination = response.pagination
      this.dataList = response.results
    }
  }
}
</script>

<style></style>
