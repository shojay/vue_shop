<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <tree-table :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" show-index
        index-text="#" border :show-row-hover="false"
      >
        <template v-slot:isValid="scope">
          <el-icon v-if="scope.row.cat_deleted === false" class='el-icon-success' style="color: limegreen;font-size: 16px"></el-icon>
          <el-icon class="el-icon-error" style="color: red;font-size: 16px" v-else></el-icon>
        </template>
        <template v-slot:order="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag v-if="scope.row.cat_level === 1" type="success">二级</el-tag>
          <el-tag v-if="scope.row.cat_level === 2" type="warning">三级</el-tag>
        </template>
        <template v-slot:operation="scope">
          <el-button size="mini" type="success" icon="el-icon-edit" @click="showEditCateDialog(scope.row)"></el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteCateById(scope.row)"></el-button>
        </template>
      </tree-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <v-dialog
      title="添加分类"
      :is-visible="addCateVisible"
      dialog-type="addCate"
      :parent-cate-list="parentCateList"
      width="50%"
      @close="clearAddCateDialog"
      @cancel="addCateVisible = false"
      @change="handleChange"
      @confirm="submitCate"
    ></v-dialog>

    <v-dialog
      title="编辑分类"
      :is-visible="editCateVisible"
      dialog-type="editCate"
      width="50%"
      :form="editForm"
      @cancel="editCateVisible = false"
      @close="clearAddCateDialog"
      @confirm="editCate"
    ></v-dialog>
  </div>
</template>

<script>
import VDialog from '../../components/dialog'
import { Loading } from 'element-ui'
export default {
  components: {
    VDialog
  },
  data() {
    return {
      cateList: [],
      total: 0,
      addCateVisible: false,
      editCateVisible: false,
      loading: true,
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isValid'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'operation'
        }
      ],
      parentCateList: [],
      editForm: {}
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const loadingInstance = Loading.service({
        background: 'rgba(0, 0, 0, 0.8)'
      })
      const { data: res } = await this.$axios.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error('获取分类列表失败')
      console.log(res.data)
      this.cateList = res.data.result
      this.total = res.data.total
      this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
        loadingInstance.close()
      })
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    showAddCateDialog() {
      this.getParentCateList()
      this.addCateVisible = true
    },
    async getParentCateList() {
      const { data: res } = await this.$axios.get('categories', {
        params: {
          type: 2
        }
      })
      if (res.meta.status !== 200) return this.$message.error('获取分类列表失败')
      console.log(res.data)
      this.parentCateList = res.data
    },
    handleChange(ref, form, selectedKeys) {
      // 如果分类选择中有值，那么值中的最后一项为父分类，分类名称的值为其子分类
      if (selectedKeys.length > 0) {
        form.cat_pid = selectedKeys[selectedKeys.length - 1]
        form.cat_level = selectedKeys.length // 子分类的层级
        return false
      } else {
        // 如果分类选择中为空，则分类名称为父分类，id为0
        form.cat_pid = 0
        form.cat_level = 0
      }
    },
    clearAddCateDialog(ref, form) {
      ref.resetFields()
      form.cat_pid = 0
      form.cat_level = 0
      this.addCateVisible = false
      this.editCateVisible = false
    },
    async submitCate(ref, form) {
      const { data: res } = await this.$axios.post('categories', form)
      if (res.meta.status !== 201) return this.$message.error('添加分类失败')
      this.$message.success('添加分类成功')
      this.getCateList()
      this.addCateVisible = false
    },
    async showEditCateDialog(row) {
      this.editCateVisible = true
      const { data: res } = await this.$axios.get(`categories/${row.cat_id}`)
      if (res.meta.status !== 200) return this.$message.error('获取当前分类失败')
      this.editForm = res.data
      console.log(row)
    },
    async editCate(ref, form) {
      const { data: res } = await this.$axios.put(`categories/${form.cat_id}`, {
        cat_name: form.cat_name
      })
      if (res.meta.status !== 200) return this.$message.error('修改分类失败')
      this.$message.success('修改分类成功')
      this.getCateList()
      this.editCateVisible = false
    },
    deleteCateById(row) {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$axios.delete(`categories/${row.cat_id}`)
        if (res.meta.status !== 200) return this.$message.error('删除失败')
        this.getCateList()
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
    }
  }
}
</script>

<style lang="less" scoped>
  .zk-table{
    margin-top: 10px;
  }
</style>
