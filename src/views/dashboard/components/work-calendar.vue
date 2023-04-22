<template>
  <div>
    <el-row type="flex" justify="end">
      <el-select v-model="currentYear" size="small" style="width: 120px" @change="dataChange">
        <el-option v-for="item in yearList" :key="item" :value="item" />
      </el-select>
      <el-select v-model="currentMonth" size="small" style="width: 120px;margin-left:10px" @change="dataChange">
        <el-option v-for="item in 12" :key="item" :value="item" />
      </el-select>
    </el-row>
    <el-calendar :value="currentDate">
      <!-- date当前单元格的日期 -->
      <template v-slot:dateCell="{date,data}">
        <div class="date-content">
          <span class="text">{{ data.day | getDay }}</span>
          <span v-if="isWeek(date)" class="rest">休</span>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
export default {
  filters: {
    getDay(date) {
      const day = date.split('-')[2]
      return day.startsWith('0') ? day.substr(1) : day
    }
  },
  props: {
    startDate: {
      type: Date,
      //   回调函数式的返回值
      default: () => new Date()
    }

  },
  data() {
    return {
      yearList: [],
      currentYear: null,
      currentMonth: null,
      currentDate: null
    }
  },
  created() {
    this.currentYear = this.startDate.getFullYear() // 获取当前的年份
    this.currentMonth = this.startDate.getMonth() + 1 // 获取当前的月份
    this.yearList = Array.from(Array(11), (value, index) => index + this.currentYear - 5)
    // this.dataChange()
  },
  methods: {
    dataChange() {
      // 通过v-model双向绑定 可以拿到数据选择变化之后的值 即最新值
      const year = this.currentYear
      const month = this.currentMonth
      this.currentDate = new Date(`${year}-${month}-1`) // 以当前月的1号为起始
    },
    // 判断是否是周末
    isWeek(date) {
      return date.getDay() === 6 || date.getDay() === 0
    }
  }
}
</script>
<style  scoped>
/deep/ .el-calendar-day {
  height: auto;
}
/deep/ .el-calendar-table__row td,
/deep/ .el-calendar-table tr td:first-child,
/deep/ .el-calendar-table__row td.prev {
  border: none;
}
.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text {
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
}
/deep/ .el-calendar-table td.is-selected .text {
  background: #409eff;
  color: #fff;
  border-radius: 50%;
}
/deep/ .el-calendar__header {
  display: none;
}
</style>
