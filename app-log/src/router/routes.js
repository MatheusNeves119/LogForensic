const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'account', component: () => import('pages/IndexPage.vue') },
      { path: '', name: 'biometric', component: () => import('pages/BiometricPage.vue') },
      { path: '', name: 'impressaodigital', component:() =>import('pages/FingerPrintPage.vue')},
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
