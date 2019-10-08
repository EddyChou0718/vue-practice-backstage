import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/login'
import Dashboard from '@/views/dashboard'
import Products from '@/components/products'
import OrderList from '@/components/orderList'
import Coupon from '@/components/coupon'
import CustomOrder from '@/components/customOrder'
import CustomCheckout from '@/components/customCheckout'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/dashboard'

    },
    {
      path: '*',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      children: [
        {
          path: 'products',
          name: 'products',
          component: Products,
          meta: {
            requiresAuth: true
          },
        },
        {
          path: 'orderList',
          name: 'orderList',
          component: OrderList,
          meta: {
            requiresAuth: true
          },
        },
        {
          path: 'coupon',
          name: 'coupon',
          component: Coupon,
          meta: {
            requiresAuth: true
          },
        },
      ]
    },
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard,
      children: [
        {
          path: 'customOrder',
          name: 'customOrder',
          component: CustomOrder
        },
        {
          path: 'customCheckout/:orderId',
          name: 'customCheckout',
          component: CustomCheckout
        }
      ]
    }
  ]
})
