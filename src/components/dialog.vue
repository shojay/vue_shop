<template>
  <el-dialog
    :title="title"
    :visible.sync="hasVisible"
    @close="$emit('close')"
    :width="width">
    <el-form v-if="this.userType" :model="Form" :rules="FormRules" ref="FormRef" label-width="70px">
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
    <el-form v-if="this.roleType" :model="roleForm" :rules="roleRules" ref="roleRef" label-width="100px">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="roleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="name">
        <el-input v-model="roleForm.desc"></el-input>
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
    }
  },
  computed: {
    userType() {
      return this.dialogType === 'edit' || this.dialogType === 'add'
    },
    roleType() {
      return this.dialogType === 'editRole' || this.dialogType === 'addRole'
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
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },
    confirm() {
      if (this.userType) {
        this.$emit('confirm', this.$refs.FormRef, this.Form)
      } else {
        this.$emit('confirm', this.$refs.roleRef, this.roleForm)
      }
    }
  },
  watch: {
    form: {
      handler(newV) {
        if (this.dialogType === 'edit') {
          this.Form = this.form
        } else if (this.dialogType === 'editRole') {
          this.roleForm = this.form
        }
      },
      deep: true
    },
    isVisible: {
      handler(newV) {
        this.hasVisible = newV
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
