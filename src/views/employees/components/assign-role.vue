<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="btnCancel">
    <!-- v-model双向绑定 用户所拥有的角色Id -->
    <el-checkbox-group v-model="roleIds">
      <!-- 选项 -->
      <!-- label存储值 存储的是角色Id 显示的是角色名 -->
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">{{ item.name }}</el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" type="primary" @click="btnOk">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getUserInfoById } from '@/api/user'
import { assignRoles } from '@/api/employees'
export default {
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    // 用户的id 用来查询当前用户的角色信息
    userId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      list: [], // 获取所有角色
      roleIds: [] // 用户所拥有的角色Id
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const { rows } = await getRoleList({ page: 1, pagesize: 20 })
      this.list = rows
    },
    async getUserInfoById(id) {
      // 这里不能用this.userId 原因是 props传值渲染是异步 我们要页面一加载就使用userId是不行的
      // 这里的方法是给父组件调用的
      const { roleIds } = await getUserInfoById(id)
      this.roleIds = roleIds
    },
    async  btnOk() {
      await assignRoles({ id: this.userId, roleIds: this.roleIds })
      //   通知父组件关闭弹层
      this.$emit('update:showRoleDialog', false)
    },
    btnCancel() {
      this.roleIds = [] // 重置roleIds
      this.$emit('update:showRoleDialog', false)
    }
  }

}
</script>

<style>

</style>
