<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert show-icon type="warning" title="注意：只允许为第三级分类设置相关参数！"></el-alert>
      <el-row>
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="selectedKeys"
            :options="cateList"
            :props="cateProps"
            @change="handleChange"></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="isBtnDisabled" @click="addVisible = true">添加参数</el-button>
          <el-table :data="manyTableData">
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag closable @close="deleteTag(scope.row, index)" v-for="(item, index) in scope.row.attr_vals" :key="item">{{ item }}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row)"></el-button>
                <el-button size='mini' type="danger" icon="el-icon-delete" @click="deleteData(scope.row)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" :disabled="isBtnDisabled" @click="addVisible = true">添加静态属性</el-button>
          <el-table :data="onlyTableData">
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag closable @close="deleteTag(scope.row, index)" v-for="(item, index) in scope.row.attr_vals" :key="item">{{ item }}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row)"></el-button>
                <el-button size='mini' type="danger" icon="el-icon-delete" @click="deleteData(scope.row)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addVisible"
      @close="clearData($refs.addRef, 'addVisible')"
      width="50%">
      <el-form :model="addForm" :rules="addRules" ref="addRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="addData">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editVisible"
      @close="clearData($refs.editRef, 'editVisible')"
      width="50%">
      <el-form :model="editForm" :rules="editRules" ref="editRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cateList: [],
      cateProps: {
        expandTrigger: 'blur',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedKeys: [],
      activeName: 'many',
      manyTableData: [],
      onlyTableData: [],
      addVisible: false,
      addForm: {
        attr_name: ''
      },
      addRules: {
        attr_name: [
          { required: true, message: '数据不能为空', trigger: 'blur' }
        ]
      },
      editVisible: false,
      editForm: {
        attr_name: ''
      },
      editRules: {
        attr_name: [
          { required: true, message: '数据不能为空', trigger: 'blur' }
        ]
      },
      inputVisible: false,
      inputValue: ''
    }
  },
  computed: {
    isBtnDisabled() {
      return this.selectedKeys.length !== 3
    },
    cateId() {
      return this.selectedKeys.length === 3 ? this.selectedKeys[this.selectedKeys.length - 1] : ''
    },
    titleText() {
      return this.activeName === 'many' ? '动态参数' : '静态属性'
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$axios.get('categories')
      if (res.meta.status !== 200) return this.$message.error('获取分类列表失败')
      this.cateList = res.data
    },
    async getParamsData() {
      if (this.selectedKeys.length < 3) {
        this.selectedKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return false
      }
      console.log(this.selectedKeys, this.cateId)
      const { data: res } = await this.$axios.get(`categories/${this.cateId}/attributes`, {
        params: {
          sel: this.activeName
        }
      })
      if (res.meta.status !== 200) return this.$message.error('获取参数列表失败')
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      console.log(res.data)
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    handleChange() {
      this.getParamsData()
    },
    handleTabClick() {
      this.getParamsData()
    },
    clearData(ref, visible) {
      ref.resetFields()
      this[visible] = false
    },
    addData() {
      this.$refs.addRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$axios.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 201) return this.$message.error('添加失败')
        this.$message.success('添加成功')
        this.getParamsData()
        this.addVisible = false
      })
    },
    async showEditDialog(row) {
      console.log(row)
      const { data: res } = await this.$axios.get(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        params: {
          attr_sel: this.activeName
        }
      })
      if (res.meta.status !== 200) return this.$message.error('获取参数失败')
      this.editForm = res.data
      this.editVisible = true
    },
    editData() {
      this.$refs.editRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$axios.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 200) return this.$message.error(`修改${this.titleText}失败`)
        this.getParamsData()
        this.$message.success(`修改${this.titleText}成功`)
        this.editVisible = false
      })
    },
    deleteData(row) {
      this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$axios.delete(`categories/${this.cateId}/attributes/${row.attr_id}`)
        if (res.meta.status !== 200) return this.$message.error('删除失败')
        this.$message.success('删除成功')
        this.getParamsData()
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
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return false
      }
      // 这里输入的内容合法，执行以下代码
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      const { data: res } = await this.$axios.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: this.activeName,
        attr_vals: row.attr_vals.join(',')
      })
      if (res.meta.status !== 200) return this.$message.error('修改参数失败')
    },
    showInput(row) {
      row.inputVisible = true
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    async deleteTag(row, index) {
      row.attr_vals.splice(index, 1)
      const { data: res } = await this.$axios.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: this.activeName,
        attr_vals: row.attr_vals.join(',')
      })
      if (res.meta.status !== 200) return this.$message.error('修改参数失败')
      console.log(row.attr_vals, index)
    }
  }
}
</script>

<style lang="less" scoped>
  .el-row{
    margin: 15px;
  }
  .el-tag{
    margin-right: 10px;
  }
  .input-new-tag{
    width: 120px;
  }
</style>
