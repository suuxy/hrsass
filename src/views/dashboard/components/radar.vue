<template>
  <div ref="myDiv" class="radar-echart" />
</template>

<script>
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core'
// 引入柱状图图表，图表后缀都为 Chart
import { RadarChart } from 'echarts/charts'
// 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components'
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers'

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  RadarChart,
  CanvasRenderer
])

export default {
  // 页面渲染完毕 dom元素挂载之后才能获取到dom元素
  mounted() {
    const myChart = echarts.init(this.$refs.myDiv) // 得到图表实例
    myChart.setOption({
      title: {
        text: '基础雷达图'
      },
      tooltip: {},
      legend: {
        data: ['预算分配（Allocated Budget）', '实际开销（Actual Spending）']
      },
      radar: {
        // shape: 'circle',
        name: {
          textStyle: {
            color: '#fff',
            backgroundColor: '#999',
            borderRadius: 3,
            padding: [3, 5]
          }
        },
        // 每个区域的最高值
        indicator: [
          { name: '工作效率', max: 100 },
          { name: '考勤', max: 100 },
          { name: '积极性', max: 100 },
          { name: '帮助同事', max: 100 },
          { name: '自主学习', max: 100 },
          { name: '正确率', max: 100 }
        ]
      },
      series: [{
        name: '预算 vs 开销（Budget vs spending）',
        type: 'radar',
        // areaStyle: {normal: {}},
        data: [
          {
            value: [10, 1, 100, 5, 100, 0],
            name: '张三'
          },
          {
            value: [50, 50, 50, 50, 50, 10],
            name: '李四'
          }
        ]
      }]
    })
  }

}

</script>

<style>
.radar-echart {
  width: 600px;
  height: 400px;
}
</style>
