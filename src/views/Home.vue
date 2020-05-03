<template>
  <div>
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  name: 'home',
  methods: {
    logout() {
      window.sessionStorage.removeItem('token')
      this.$router.replace('/login')
    }
  }
}
</script>
