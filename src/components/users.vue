<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" class="input-with-select"
                    @clear="getUserList('',1,2)"
                    v-model="query"
                    clearable>
            <el-button slot="append" icon="el-icon-search" @click="getUserList(query,1,2)"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="userList"
        stripe
        border
        style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="电话">
        </el-table-column>
        <el-table-column prop="role_name" label="角色">
        </el-table-column>
        <el-table-column label="状态">
          <template v-slot="scope">
            <el-switch
              @change="userStateChange(scope.row)"
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#dddddd">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteConfirm(scope.row.id)"></el-button>
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="success" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="curPage"
        :page-sizes="[1, 2, 3, 5]"
        :page-size="newSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <el-dialog
      title="提示"
      :visible.sync="addVisible"
      @close="closeAddDialog"
      width="50%">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="editVisible"
      width="50%">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    var checkEmail = (rule, val, callback) => {
      var emailReg = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/g
      if (emailReg.test(val)) {
        return callback()
      }
      return callback(new Error('Email格式不正确'))
    }
    var checkMobile = (rule, val, callback) => {
      var mobileReg = /^1[3456789]\d{9}$/g
      if (mobileReg.test(val)) {
        return callback()
      }
      return callback(new Error('电话号码格式不正确'))
    }
    return {
      userList: [],
      total: 0,
      query: '',
      newSize: 0,
      curPage: 0,
      addVisible: false,
      addForm: {
        username: '',
        email: '',
        mobile: '',
        password: ''
      },
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      editVisible: false,
      editForm: {
        username: '',
        email: '',
        mobile: ''
      },
      editFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUserList('', 1, 2)
  },
  methods: {
    handleSizeChange(newSize) {
      this.newSize = newSize
      this.getUserList(this.query, this.curPage, newSize)
    },
    handleCurrentChange(curPage) {
      this.curPage = curPage
      this.getUserList(this.query, curPage, this.newSize)
    },
    closeAddDialog() {
      this.$refs.addFormRef.resetFields()
    },
    // closeEditDialog() {
    //   this.$refs.editFormRef.resetFields()
    // },
    deleteConfirm(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$axios.delete(`users/${id}`)
        if (res.meta.status !== 200) return this.$message.error('删除失败')
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getUserList('', 1, 2)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    async showEditDialog(id) {
      this.editVisible = true
      const { data: res } = await this.$axios.get(`users/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('编辑失败')
      }
      this.editForm = res.data
    },
    async addUser() {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) return false
      })
      const { data: res } = await this.$axios.post('users', this.addForm)
      if (res.meta.status !== 201) {
        return this.$message.error('添加用户失败')
      }
      this.$message.success('添加用户成功')
      this.addVisible = false
      this.getUserList('', 1, 2)
    },
    async editUser() {
      this.$refs.editFormRef.validate(valid => {
        if (!valid) return false
      })
      const { data: res } = await this.$axios.put(`users/${this.editForm.id}`, {
        email: this.editForm.email,
        mobile: this.editForm.mobile
      })
      if (res.meta.status !== 200) {
        return this.$message.error('更新失败')
      }
      this.$message.success('更新成功')
      this.editVisible = false
      this.getUserList('', 1, 2)
    },
    // 获取用户列表
    async getUserList(query = '', pagenum, pagesize) {
      const { data: res } = await this.$axios.get('users', {
        params: {
          query,
          pagenum,
          pagesize
        }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取管理员列表失败')
      }
      this.userList = res.data.users
      this.newSize = pagesize
      this.curPage = pagenum
      console.log(this.curPage)
      this.total = res.data.total
      console.log(res)
    },
    // 修改用户状态
    async userStateChange(userInfo) {
      const { data: res } = await this.$axios.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if (res.meta.status !== 200) {
        this.$message.error('更新用户状态失败')
        userInfo.mg_state = !userInfo.mg_state
        return false
      }
      this.$message.success('更新用户状态成功')
    }
  }
}
</script>

<style lang="less" scoped></style>
