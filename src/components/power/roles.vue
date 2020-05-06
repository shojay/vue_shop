<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoleVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList" stripe border>
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row v-for="(item, index) in scope.row.children" :key="item.id" :class="['bdBottom', index === 0 ? 'bdTop' : '', 'vcenter']">
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item.id)">{{ item.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row v-for="(item1, index1) in item.children" :key="item1.id" :class="[index1 !== 0 ? 'bdTop' : '', 'vcenter']">
                  <el-col :span="5">
                    <el-tag type="success" closable @close="removeRightById(scope.row, item1.id)">{{ item1.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="19">
                    <el-tag closable @close="removeRightById(scope.row, item2.id)" v-for="(item2) in item1.children" :key="item2.id" type="warning">{{ item2.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
<!--            <pre>{{ scope.row }}</pre>-->
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditRoleDialog(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteRoleById(scope.row)">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="showRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      title="分配权限"
      :visible.sync="rightsVisible"
      width="30%"
      @close="clearDefaultKeys"
    >
      <el-tree
        ref="treeRef"
        :data="rightsList"
        :props="rightsProps"
        show-checkbox
        default-expand-all
        :default-checked-keys="defaultKeys"
        node-key="id"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightsVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
    <v-dialog
      title="添加角色"
      :is-visible="addRoleVisible"
      dialog-type="addRole"
      width="50%"
      @confirm="addRole"
      @close="addRoleVisible = false"
      @cancel="addRoleVisible = false"
    ></v-dialog>
    <v-dialog
      title="编辑角色"
      :is-visible="editRoleVisible"
      dialog-type="editRole"
      width="50%"
      :form="roleForm"
      @confirm="editRole"
      @close="editRoleVisible = false"
      @cancel="editRoleVisible = false"
    ></v-dialog>
  </div>
</template>

<script>
import VDialog from '../dialog'
export default {
  components: {
    VDialog
  },
  data() {
    return {
      rolesList: [],
      rightsList: [],
      rightsProps: {
        children: 'children',
        label: 'authName'
      },
      roleForm: {
        name: '',
        desc: ''
      },
      defaultKeys: [],
      roleId: '',
      rightsVisible: false,
      addRoleVisible: false,
      editRoleVisible: false
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$axios.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败')
      this.rolesList = res.data
    },
    removeRightById(role, rightId) {
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$axios.delete(`roles/${role.id}/rights/${rightId}`)
        if (res.meta.status !== 200) return this.$message.error('删除权限失败')
        role.children = res.data
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    deleteRoleById(role) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$axios.delete(`roles/${role.id}`)
        if (res.meta.status !== 200) return this.$message.error('删除角色失败')
        this.getRolesList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    async showRightDialog(role) {
      this.roleId = role.id
      const { data: res } = await this.$axios.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error('获取权限列表失败')
      this.rightsList = res.data
      // 递归获取第三层权限id
      this.getRightsKeys(role, this.defaultKeys) // role为角色的所有层数据，通过role往下递归找到最后一层的所有数据
      this.rightsVisible = true
    },
    getRightsKeys(node, arr) {
      // 当前为最后一层即第三层
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach((item) => {
        this.getRightsKeys(item, arr)
      })
    },
    clearDefaultKeys() {
      this.defaultKeys = []
    },
    async allotRights() {
      const treeRef = this.$refs.treeRef
      const keys = [
        ...treeRef.getCheckedKeys(),
        ...treeRef.getHalfCheckedKeys()
      ]
      const keysStr = keys.join(',')
      const { data: res } = await this.$axios.post(`roles/${this.roleId}/rights`, {
        rids: keysStr
      })
      if (res.meta.status !== 200) return this.$message.error('提交失败')
      this.$message.success('修改权限成功')
      this.getRolesList()
      this.rightsVisible = false
    },
    async addRole(ref, form) {
      const { data: res } = await this.$axios.post('roles', {
        roleName: form.name,
        roleDesc: form.desc
      })
      if (res.meta.status !== 201) return this.$message.error('添加角色失败')
      this.$message.success('添加角色成功')
      this.getRolesList()
      this.addRoleVisible = false
    },
    showEditRoleDialog(role) {
      this.userInfo = role
      this.editRoleVisible = true
      this.roleForm.name = role.roleName
      this.roleForm.desc = role.roleDesc
    },
    async editRole(ref, form) {
      const { data: res } = await this.$axios.put(`roles/${this.userInfo.id}`, {
        roleName: form.name,
        roleDesc: form.desc
      })
      if (res.meta.status !== 200) return this.$message.error('修改角色失败')
      this.$message.success('修改角色成功')
      this.getRolesList()
      this.editRoleVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
  .el-tag{
    margin: 7px;
  }
  .bdTop{
    border-top: 1px solid #eee;
  }
  .bdBottom{
    border-bottom: 1px solid #eee;
  }
  .vcenter{
    display: flex;
    align-items: center;
  }
</style>
