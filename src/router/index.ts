import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/reporte-unificado-ibc-reserva',
    meta: {
      title: "Reporte Unificado IBC para Reservas",
      requiresAuth: true
    },
    component: () => import(/* webpackChunkName: "reporteUnificadoIBCReserva" */ '../views/reporteUnificadoIBCReserva/ViewReporteUnificadoIBCReserva.vue')
  },
  {
    path: '/reporte-consolidado-reserva',
    meta: {
      title: "Reporte Unificado IBC para Reservas",
      requiresAuth: true
    },
    component: () => import(/* webpackChunkName: "reporteUnificadoIBCReserva" */ '../views/reporteConsolidadoReserva/ViewReporteConsolidadoReserva.vue')
  },
  {
    path: '/reporte-consulta-unificada-at',
    meta: {
      title: "Reporte Consulta Unificada AT",
      requiresAuth: false
    },
    component: () => import(/* webpackChunkName: "reporteUnificadoIBCReserva" */ '../views/reporteConsultaUnificadaAT/ViewReporteConsultaUnificadaAT.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((<any>window).VueUtils.RouterBeforeEach);

export default router
