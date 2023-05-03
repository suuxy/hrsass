import Layout from '@/layout'
export default {
  path: '/employees',
  name: 'employees',
  component: Layout,
  children: [
    {
      path: '', // 这里当二级路由的path什么都不写的时候 表示该路由为当前二级路由的默认路由
      component: () => import('@/views/employees'), // 当你的访问地址 是 /employees的时候 layout组件会显示 此时 你的二级路由的默认组件=>员工主页 也会显示
      // 路由元信息  其实就是存储数据的对象 我们可以在这里放置一些信息
      name: 'employees',
      meta: {
        title: '员工管理', // meta属性的里面的属性 随意定义 但是这里为什么要用title呢， 因为左侧导航会读取我们的路由里的meta里面的title作为显示菜单名称
        icon: 'people'
      }
    },
    {
      path: 'detail/:id',
      component: () => import('@/views/employees/detail'),
      hidden: true,
      meta: {
        title: '员工详情' // 标记当前路由规则的中文名称 后续在做左侧菜单时 使用
      }
    },
    {
      path: 'print/:id',
      component: () => import('@/views/employees/components/print'),
      hidden: true,
      meta: {
        title: '员工打印'
      }
    }
  ]
}
