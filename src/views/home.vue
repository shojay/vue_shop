<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#fff"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
          active-text-color="#409eff">
          <el-submenu :index="index.toString()" v-for="(item, index) in menuList" :key="item.id">
            <template slot="title">
              <i :class="'iconfont icon-' + iconList[index]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <template v-if="item.children">
              <el-menu-item :index="'/' + item.path" v-for="(v) in item.children" :key="v.id" @click="savePath('/' + item.path)">
                <i class="el-icon-menu"></i>
                <span>{{ v.authName }}</span>
              </el-menu-item>
            </template>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'home',
  data() {
    return {
      menuList: [],
      iconList: ['users', 'tijikongjian', 'shangpingouwudai2', 'danju', 'baobiao'],
      isCollapse: false,
      activePath: ''
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    savePath(path) {
      window.sessionStorage.setItem('activePath', path)
      this.activePath = path
    },
    logout() {
      window.sessionStorage.removeItem('token')
      this.$router.replace('/login')
    },
    async getMenuList() {
      const { data: res } = await this.$axios.get('menus')
      if (res.meta.status !== 200) {
        return this.$message.error('获取菜单数据失败')
      }
      this.menuList = res.data
    }
  }
}
</script>

<style lang="less" scoped>
  .home-container{
    height: 100%;
  }
  .el-header{
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    > div{
      color: #fff;
      font-size: 20px;
    }
  }
  .el-aside{
    background-color: #333744;
    .toggle-button{
      background-color: #4a5064;
      font-size: 10px;
      line-height: 24px;
      color: #fff;
      letter-spacing: 0.2em;
      text-align: center;
      cursor: pointer;
    }
    .el-menu{
      border: 0;
    }
  }
  .el-main{
    background-color: #EAEDF1;
  }
  .iconfont{
    margin-right: 10px;
  }
</style>
