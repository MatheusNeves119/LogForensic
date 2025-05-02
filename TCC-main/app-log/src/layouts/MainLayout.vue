<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated >
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> Log Forensic </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Menus </q-item-label>

        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
          style="font-size: 18px; color: #007bff"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import {
  ipFaceRecognition,
  ipDatabaseAlert,
  ipPowerSupplyOne,
} from 'quasar-extras-svg-icons/iconpark-icons'

import { matLocationOn, matNotifications } from '@quasar/extras/material-icons'

const linksList = [
  {
    title: 'Alarme',
    caption: '',
    icon: 'alarm',
    route: { name: 'fingerPrint' },
  },
  {
    title: 'Bateria',
    caption: '',
    icon: ipPowerSupplyOne,
    route: { name: 'fingerPrint' },
  },
  {
    title: 'Biometria',
    caption: '',
    icon: ipFaceRecognition,
    route: { name: 'biometric' },
  },
  {
    title: 'Bluetooth',
    caption: '',
    icon: 'bluetooth',
    route: { name: 'fingerPrint' },
  },
  {
    title: 'Contas',
    caption: '',
    icon: 'account_circle',
    route: { name: 'account' },
  },
  {
    title: 'Energia',
    caption: '',
    icon: 'power',
    route: { name: 'fingerPrint' },
  },
  {
    title: 'Info Banco',
    caption: '',
    icon: ipDatabaseAlert,
    route: { name: 'fingerPrint' },
  },
  {
    title: 'Impressão Digital',
    caption: '',
    icon: 'fingerprint',
    route: { name: 'impressaodigital' },
  },
  {
    title: 'Localização',
    caption: '',
    icon: matLocationOn,
    route: { name: 'fingerPrint' },
  },
  {
    title: 'Notificação',
    caption: '',
    icon: matNotifications,
    route: { name: 'fingerPrint' },
  },
  {
    title: 'Telefone',
    caption: '',
    icon: 'power',
    route: { name: 'fingerPrint' },
  },
  {
    title: 'Wifi',
    caption: '',
    icon: 'wifi',
    route: { name: 'fingerPrint' },
  },
]

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
