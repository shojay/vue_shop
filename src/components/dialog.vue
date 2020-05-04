<template>
  <el-dialog
    :title="title"
    :visible.sync="isVisible"
    :width="width">
    <el-form :model="Form" :rules="FormRules" ref="FormRef" label-width="70px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="Form.username"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="Form.email"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="Form.password" type="password"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="mobile">
        <el-input v-model="Form.mobile"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="$emit('cancel')">取 消</el-button>
        <el-button type="primary" @click="$emit('confirm')">确 定</el-button>
      </span>
  </el-dialog>
</template>

<script>
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
    }
  },
  data() {
    return {
      Form: {
        username: '',
        email: '',
        mobile: '',
        password: ''
      },
      FormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话号码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" scoped></style>
