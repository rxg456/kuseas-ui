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
          <el-input placeholder="请输入搜索关键字" v-model="search">
            <el-button slot="append" icon="el-icon-search" @click="getList(1)"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="dataList" style="width: 100%">
        <el-table-column prop="id" label="ID"> </el-table-column>
        <el-table-column prop="username" label="用户名"> </el-table-column>
        <el-table-column prop="is_superuser" label="用户角色">
          <template #default="{ row }">
            {{ row.is_superuser ? '管理员' : '普通用户' }}
          </template>
        </el-table-column>
        <el-table-column prop="is_active" label="激活">
          <template #default="{ row }">
            <el-switch v-model="row.is_active" @change="handleIsactiveChange(row.id, row.is_active)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="phone" label="电话"> </el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template #default="{ row }">
            <el-tooltip v-if="row.id !== 1" content="修改" placement="top" effect="dark">
              <el-button size="mini" icon="el-icon-edit" @click="handleEdit(row)"></el-button>
            </el-tooltip>
            <el-tooltip v-if="row.id !== 1" content="删除" placement="top" effect="dark">
              <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(row.id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page="page"
        :page-sizes="pageSizes"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 新增 -->
    <el-dialog title="提示" :visible.sync="addDialogVisible" width="38%">
      <!-- <el-dialog title="提示" :visible.sync="addDialogVisible" width="38%" @close="resetForm('add')"> -->
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
    <!-- 修改用户 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="38%">
      <el-form :model="editForm" :rules="editRules" ref="edit" label-width="100px">
        <el-form-item label="用户名称" prop="username">
          {{ editForm.username }}
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="editForm.phone"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="edit">确 定</el-button>
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
      search: '',
      addDialogVisible: false,
      dataList: [],
      // 分页数据
      total: 0,
      page: 1,
      size: 20,
      pageSizes: [20, 50, 100, 200],

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
      },
      // 修改用户
      editDialogVisible: false,
      editForm: {
        username: '',
        email: '',
        phone: ''
      },
      editRules: {}
    }
  },
  methods: {
    handleSizeChange(val) {
      this.size = val
      this.getList(1, val)
    },
    handleCurrentChange(val) {
      this.getList(val, this.size)
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
    async getList(page, size) {
      if (!page) {
        page = this.page
      }
      if (!size) {
        size = this.size
      }
      const { data: response } = await this.$http.get('users/', {
        params: {
          page,
          page_size: size,
          search: this.search
        }
      }) // mix list
      if (response.code) {
        return this.$message.error(response.message)
      }
      this.total = response.pagination.total
      this.page = response.pagination.page
      this.dataList = response.results
    },
    async handleIsactiveChange(id, isActive) {
      // 激活或禁用某一个具体的用户
      // 安装序列化器要求提供所有必须字段
      // is_active最划算的方式是提交1个字段值，要通过序列化器校验，就必须patch
      const { data: response } = await this.$http.patch(`users/${id}/`, {
        is_active: isActive
      })
      if (response.code) {
        return this.message.error(response.message)
      }
      this.getList(this.pagination.page)
    },
    // 修改
    handleEdit(row) {
      this.editForm = row
      this.editDialogVisible = true
    },
    edit() {
      const { id } = this.editForm
      const name = 'edit'
      this.$refs[name].validate(async (valid) => {
        if (valid) {
          const { data: response } = await this.$http.patch(`users/${id}/`, this.editForm)
          if (response.code) {
            return this.$message.error(response.message)
          }
          this.editDialogVisible = false
          this.getList(this.pagination.page)
        }
      })
    },
    // 删除
    handleDelete(id) {
      this.$msgbox
        .confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        })
        .then(async () => {
          const { data: response } = await this.$http.delete(`users/${id}/`)
          if (response.code) {
            return this.$message.error(response.message)
          }
          this.getList()
        })
        .catch(() => {})
    }
  }
}
</script>

<style></style>
