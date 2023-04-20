<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTools :show-before="true">
        <span slot="before">共{{ page.total }}条记录</span>
        <el-button
          slot="after"
          size="small"
          type="success"
          @click="$router.push('/import')"
        >导入</el-button>
        <el-button
          slot="after"
          size="small"
          type="danger"
          @click="exportData"
        >导出</el-button>
        <el-button
          slot="after"
          :disabled="!checkPermission('POINT-USER-ADD')"
          size="small"
          type="primary"
          @click="showDialog = true"
        >新增员工</el-button>
      </PageTools>
      <!-- 放置表格和分页 -->
      <el-card>
        <el-table v-loading="loading" border :data="list">
          <el-table-column type="index" label="序号" sortable="" />
          <el-table-column prop="username" label="姓名" sortable="" />
          <el-table-column label="头像" align="center">
            <template slot-scope="{row}">
              <img v-imagerror="require('@/assets/common/head.jpg')" :src="row.staffPhoto" alt="" style="border-radius: 50%; width: 100px; height: 100px; padding: 10px">
            </template>
          </el-table-column>
          <el-table-column prop="workNumber" label="工号" sortable="" />
          <el-table-column
            prop="formOfEmployment"
            :formatter="formatEmployment"
            label="聘用形式"
            sortable=""
          />
          <el-table-column prop="departmentName" label="部门" sortable="" />
          <el-table-column prop="timeOfEntry" label="入职时间" sortable="">
            <template slot-scope="{ row }">{{
              row.timeOfEntry | formatDate
            }}</template>
          </el-table-column>
          <el-table-column prop="enableState" label="账户状态" sortable="">
            <template slot-scope="{ row }">
              <el-switch :value="row.enableState === 1" />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template v-slot="{ row }">
              <el-button :disabled="!checkPermission('POINT-USER-UPDATE')" type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="editRole(row.id)">角色</el-button>
              <el-button
                :disabled="!checkPermission('point-user-delete')"
                type="text"
                size="small"
                @click="delEmployee(row.id)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <!-- 放置分页 -->
      <el-row type="flex" justify="center" align="middle" style="height: 60px">
        <el-pagination
          :current-page="page.page"
          :page-size="page.size"
          :total="page.total"
          layout="prev, pager, next"
          @current-change="changePage"
        />
      </el-row>
    </div>
    <!-- 放置弹层组件 -->
    <add-employee :show-dialog.sync="showDialog" />
    <assign-role ref="assignRole" :show-role-dialog.sync="showRoleDialog" :user-id="userId" />
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import AddEmployee from './components/add-employee.vue'
import { formatDate } from '@/filters'
import AssignRole from './components/assign-role.vue'
export default {
  components: {
    AddEmployee,
    AssignRole
  },
  data() {
    return {
      list: [],
      page: {
        page: 1,
        size: 10,
        total: 0
      },
      loading: false,
      showDialog: false,
      showRoleDialog: false, // 控制角色分配弹层的显示
      userId: null
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList() {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.page)
      this.page.total = total
      this.list = rows
      this.loading = false
    },
    changePage(newPage) {
      this.page.page = newPage
      // 重新拉取数据
      this.getEmployeeList()
    },
    // 格式化聘用形式
    formatEmployment(row, column, cellValue, index) {
      // 找1所对应的值
      const item = EmployeeEnum.hireType.find((item) => item.id === cellValue)
      return item ? item.value : '未知'
    },
    async delEmployee(id) {
      try {
        // 确定进入then 取消进入catch
        await this.$confirm('您确定删除该员工吗')
        await delEmployee(id)
        this.$message.success('删除员工成功')
        this.getEmployeeList() // 重新拉取数据
      } catch (error) {
        console.log(error)
      }
    },
    exportData() {
      const headers = {
        手机号: 'mobile',
        姓名: 'username',
        入职日期: 'timeOfEntry',
        聘用形式: 'formOfEmployment',
        转正日期: 'correctionTime',
        工号: 'workNumber',
        部门: 'departmentName'
      }
      import('@/vendor/Export2Excel').then(async(excel) => {
        const { rows } = await getEmployeeList({
          page: 1,
          size: this.page.total
        })
        const data = this.formatJson(headers, rows)
        excel.export_json_to_excel({
          // header: ['姓名', '工资'], // 表头 必填
          // data: [['张三', 4000], ['李四', 3000]], // 具体数据 必填
          // filename: 'excel-list' // 非必填 文件名
          headers: Object.keys(headers),
          data
        })
      })
      // data 为[[]]格式 [{username:张三,mobile:13123456789}] => [[]] data里只要value
      // 表格标题为中文 key为英文 英文 =>中文
    },
    formatJson(headers, rows) {
      return rows.map((item) => {
        // 按照表头的顺序取值
        return Object.keys(headers).map(key => {
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            // 格式化时间
            return formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            // 转化聘用形式 1=>正式 2=>非正式 比对数据
            const obj = EmployeeEnum.hireType.find(obj => obj.id === item[headers[key]])
            return obj ? obj.value : '未知'
          }
          return item[headers[key]]
        })
      })
    },
    async editRole(id) {
      this.userId = id
      await this.$refs.assignRole.getUserInfoById(id) // async 修饰的是 异步方法 先等待获取完所拥有的的角色Id 再显示弹层
      this.showRoleDialog = true
    }
  }
}
</script>

<style>
</style>
