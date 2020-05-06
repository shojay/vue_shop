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
        <el-table-column v-for="(item) in tableList"
                         :key="item.prop"
                         :prop="item.prop"
                         :label="item.label"
                         width="180">
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
              <el-button type="success" icon="el-icon-setting" size="mini" @click="showAllotDialog(scope.row)"></el-button>
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
    <v-dialog
      title="添加用户"
      :is-visible="addVisible"
      width="50%"
      dialog-type="add"
      @cancel="addVisible = false"
      @confirm="addUser"
      @close="addVisible = false"
    >
    </v-dialog>
    <v-dialog
      title="编辑用户"
      :is-visible="editVisible"
      :form="form"
      width="50%"
      dialog-type="edit"
      @cancel="editVisible = false"
      @confirm="editUser"
      @close="editVisible = false"
    >
    </v-dialog>
    <el-dialog
      title="分配角色"
      :visible.sync="allotVisible"
      width="30%"
      @close="clearData"
    >
      <p>姓名：{{ userInfo.username }}</p>
      <p>角色：{{ userInfo.role_name }}</p>
      <p>选择角色：
        <el-select v-model="selectedRoleId" placeholder="请选择">
          <el-option
            v-for="item in rolesList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id">
          </el-option>
        </el-select>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="allotVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import VDialog from './dialog'
export default {
  components: {
    VDialog
  },
  data() {
    return {
      userList: [],
      tableList: [
        { prop: 'username', label: '姓名' },
        { prop: 'email', label: '邮箱' },
        { prop: 'mobile', label: '电话' },
        { prop: 'role_name', label: '角色' }
      ],
      form: {},
      total: 0,
      query: '',
      newSize: 0,
      curPage: 0,
      addVisible: false,
      editVisible: false,
      allotVisible: false,
      userInfo: {}, // 用户信息
      selectedRoleId: '',
      rolesList: []
    }
  },
  created() {
    this.getUserList('', 1, 2)
    this.getRolesList()
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
      this.form = res.data
    },
    async addUser(ref, form) {
      ref.validate(valid => {
        if (!valid) return false
      })
      const { data: res } = await this.$axios.post('users', form)
      if (res.meta.status !== 201) {
        return this.$message.error('添加用户失败')
      }
      this.$message.success('添加用户成功')
      this.addVisible = false
      this.getUserList('', 1, 2)
    },
    async editUser(ref, form) {
      ref.validate(valid => {
        if (!valid) return false
      })
      const { data: res } = await this.$axios.put(`users/${form.id}`, {
        email: form.email,
        mobile: form.mobile
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
      this.total = res.data.total
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
    },
    async getRolesList() {
      const { data: res } = await this.$axios.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败')
      this.rolesList = res.data
    },
    // 展示分配角色对话框
    showAllotDialog(role) {
      this.userInfo = role
      this.allotVisible = true
    },
    async allotRole() {
      const { data: res } = await this.$axios.put(`users/${this.userInfo.id}/role`, {
        rid: this.selectedRoleId
      })
      if (res.meta.status !== 200) return this.$message.error('修改角色失败')
      this.$message.success('修改角色成功')
      this.getUserList('', 1, 2)
      this.allotVisible = false
    },
    clearData() {
      this.userInfo = {}
      this.selectedRoleId = ''
    }
  }
}
</script>

<style lang="less" scoped></style>
