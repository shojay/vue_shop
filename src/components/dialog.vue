<template>
  <el-dialog
    :title="title"
    :visible.sync="hasVisible"
    @close="handleClose"
    :width="width">
    <el-form v-if="userType" :model="Form" :rules="FormRules" ref="FormRef" label-width="70px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="Form.username" :disabled="dialogType === 'edit'"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="Form.email"></el-input>
      </el-form-item>
      <template v-if="this.dialogType === 'add'">
        <el-form-item label="密码" prop="password">
          <el-input v-model="Form.password" type="password"></el-input>
        </el-form-item>
      </template>
      <el-form-item label="电话" prop="mobile">
        <el-input v-model="Form.mobile"></el-input>
      </el-form-item>
    </el-form>
    <el-form v-if="roleType" :model="roleForm" :rules="roleRules" ref="roleRef" label-width="100px">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="roleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="name">
        <el-input v-model="roleForm.desc"></el-input>
      </el-form-item>
    </el-form>
    <el-form v-if="cateType" :model="cateForm" :rules="cateRules" ref="cateRef" label-width="100px">
      <el-form-item label="分类名称" prop="cat_name">
        <el-input v-model="cateForm.cat_name"></el-input>
      </el-form-item>
      <el-form-item v-if="dialogType !== 'editCate'" label="分类选择">
        <!-- v-model的数组是配合props中的value值的集合 options是数据源 @change事件触发v-model值的变化， props中的值是对应options数据源来匹配的 -->
        <el-cascader
          v-model="selectedKeys"
          :options="parent_cate_list"
          :props="cateProps"
          @change="handleChange"
          clearable
        >
        </el-cascader>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="$emit('cancel')">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
  </el-dialog>
</template>

<script>
import { checkMobile, checkEmail } from '../common/reg.js'
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    isVisible: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '50%'
    },
    dialogType: {
      type: String
    },
    form: {
      type: Object
    },
    parentCateList: {
      type: Array
    }
  },
  computed: {
    userType() {
      return this.dialogType === 'edit' || this.dialogType === 'add'
    },
    roleType() {
      return this.dialogType === 'editRole' || this.dialogType === 'addRole'
    },
    cateType() {
      return this.dialogType === 'addCate' || this.dialogType === 'editCate'
    }
  },
  data() {
    return {
      hasVisible: false,
      Form: {
        username: '',
        email: '',
        mobile: '',
        password: ''
      },
      FormRules: {
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
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      roleForm: {
        name: '',
        desc: ''
      },
      roleRules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ]
      },
      cateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      cateRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      selectedKeys: [],
      parent_cate_list: [],
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      }
    }
  },
  methods: {
    handleClose() {
      if (this.cateType) {
        this.selectedKeys = []
        this.$emit('close', this.$refs.cateRef, this.cateForm)
      } else {
        this.$emit('close')
      }
    },
    confirm() {
      if (this.userType) {
        this.$emit('confirm', this.$refs.FormRef, this.Form)
      } else if (this.roleType) {
        this.$emit('confirm', this.$refs.roleRef, this.roleForm)
      } else if (this.cateType) {
        // console.log(this.cateForm, this.selectedKeys, this.parent_cate_list)
        this.$emit('confirm', this.$refs.cateRef, this.cateForm)
      }
    },
    handleChange() {
      this.$emit('change', this.$refs.cateRef, this.cateForm, this.selectedKeys)
    }
  },
  watch: {
    form: {
      handler(newV) {
        if (this.dialogType === 'edit') {
          this.Form = this.form
        } else if (this.dialogType === 'editRole') {
          this.roleForm = this.form
        } else if (this.dialogType === 'editCate') {
          this.cateForm = this.form
        }
      },
      deep: true
    },
    isVisible: {
      handler(newV) {
        this.hasVisible = newV
      }
    },
    parentCateList: {
      handler(newObj) {
        this.parent_cate_list = newObj
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
