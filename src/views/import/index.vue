<template>
  <upload-excel :on-success="success" />

</template>

<script>
import { importEmployee } from '@/api/employees'
export default {
  methods: {
    async success({ header, results }) {
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      //   var newArr = results.map(item => {
      //     var userInfo = {}
      //     Object.keys(item).forEach(key => {
      //       // 原来中文对应的值 赋值给 英文对应的值
      //       userInfo[userRelations[key]] = item[key]
      //     })
      //     return userInfo
      //   })
      //   await importEmployee(newArr)
      const arr = []
      results.forEach(item => {
        const userInfo = {}
        Object.keys(item).forEach(key => {
          if (userRelations[key] === 'timeOfEntry' || userRelations[key] === 'correctionTime') {
            // 后端接口限制了 值不能是字符串 要转换为时间类型 才能存入数据库
            userInfo[userRelations[key]] = new Date(this.formatDate(item[key], '/'))
          } else {
            userInfo[userRelations[key]] = item[key]
          }
        })
        arr.push(userInfo)
      })
      await importEmployee(arr) // 调用导入接口
      this.$message.success('导入excel成功')
      this.$router.back() // 返回上一个页面
    },
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }

}
</script>

<style>

</style>
