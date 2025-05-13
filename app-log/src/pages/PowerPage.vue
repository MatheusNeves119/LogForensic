<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-table
        style="height: auto"
        flat
        bordered
        title="Eventos de Energia"
        :rows="filteredAccounts"
        :columns="columns"
        row-key="index"
        virtual-scroll
        v-model:pagination="pagination"
        :rows-per-page-options="[0]"
        :filter="filter"
      >
        <template v-slot:top-right>
          <div class="q-pa-md">
            <div class="q-gutter-sm row">
              <q-input
                filled
                v-model="time"
                mask="fulltime"
                :rules="['fulltime']"
                label="Hora Inicial"
              >
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-time v-model="time" with-seconds format24h>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Fechar" color="primary" flat />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>

              <q-input
                filled
                v-model="timeWithSeconds"
                mask="fulltime"
                :rules="['fulltime']"
                label="Hora Final"
              >
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-time v-model="timeWithSeconds" with-seconds format24h>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Fechar" color="primary" flat />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <q-input borderless dense debounce="300" v-model="filter" placeholder="Pesquise">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
          </div>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn icon="edit" color="blue" dense size="sm" @click="updateAccount(props.row.id)" />
            <q-btn
              style="margin-left: 8px"
              icon="delete"
              color="negative"
              dense
              size="sm"
              @click="removeAccount(props.row.id)"
            />
          </q-td>
        </template>
      </q-table>
    </div>
    <div>
      <q-btn class="load-button" label="Adicionar" @click="addPowerLog"></q-btn>
    </div>
  </q-page>
</template>

<script>
import { ref, defineComponent, onMounted } from 'vue'
import { api } from 'boot/axios'

export default defineComponent({
  name: 'PowerPage',

  setup() {
    const Power = ref([])
    const filteredAccounts = ref([])
    const time = ref('')
    const timeWithSeconds = ref('')
    const filter = ref('')
    const pagination = ref({ rowsPerPage: 10 })

    const columns = [
      { name: 'id',
        field: 'id',
        label: 'ID',
        sortable: true,
        align: 'left' 
      },
      { name: 'action',
        field: 'wakeReason',
        label: 'Ação',
        sortable: true,
        align: 'left' 
      },
      {
        name: 'inicialTime',
        field: 'timestamp',
        label: 'Data',
        sortable: true,
        align: 'left',
        format: (val) => formatarDataColuna(val),
      },
      { 
        name: 'link',
        field: 'app',
        label: 'Link/APP',
        sortable: true,
        align: 'left' ,
      },
      {
        name: 'Estado da Tela',
        field:'screenState',
        label:'Tela',
        sortable: true,
        align:'left',
      },
    ]

    onMounted(() => {
      getAccounts()
      filteredAccounts.value = Power.value
    })


    const getAccounts = async () => {
      try {
        const response = await api.get('Power') 
        Power.value = response.data
        filteredAccounts.value = [...Power.value]
      } catch (error) {
        console.error(error)
      }
    }

    function formatarDataColuna(dataString) {
      const partesData = dataString.split(' ')
      const data = partesData[0].split('-')
      const hora = partesData[1]
      return `${data[2]}/${data[1]}/${data[0]} - ${hora}`
    }

    function removePowerLog(id) {
      console.log('Remover:', id)
    }

    function updatePowerLog(id) {
      console.log('Atualizar:', id)
    }

    function addPowerLog() {
      console.log('Adicionar log de energia')
    }

    const onHourInicialChange = () => {
      if (time.value) {
        const timInicial = new Date(time.value)
        const timFinal = new Date(time.value)
        timInicial.setHours(0, 0, 0, 0)
        timFinal.setHours(23, 59, 59, 999)

        filteredAccounts.value = Power.value.filter((log) => {
          const logDate = new Date(log.inicialTime)
          return logDate >= timInicial && logDate <= timFinal
        })
      } else {
        filteredAccounts.value = [...Power.value]
      }
    }

    return {
      Power,
      filteredAccounts,
      pagination,
      columns,
      filter,
      time,
      timeWithSeconds,
      onHourInicialChange,
      removePowerLog,
      updatePowerLog,
      addPowerLog,
    }
  },
})
</script>

<style>
.q-table {
  font-size: 20px;
}

.q-table td,
.q-table th {
  font-size: 20px;
}
</style>
