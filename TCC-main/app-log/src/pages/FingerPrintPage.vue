<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-table
        style="height: auto"
        flat
        bordered
        title="Impressão Digital"
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
                          <q-btn v-close-popup label="Close" color="primary" flat />
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
                          <q-btn v-close-popup label="Close" color="primary" flat />
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
    <div><q-btn class="load-button" label="Adicionar" @click="addPost"></q-btn></div>
  </q-page>
</template>

<script>
import { ref, defineComponent, onMounted } from 'vue'
import { api } from 'boot/axios'

export default defineComponent({
  name: 'FingerPrintPage',

  setup() {
    // Variáveis reativas
    const fingerPrints = ref([])
    const pagination = ref({
      rowsPerPage: 10,
    })

    const filteredAccounts = ref([])
    const time = ref('')
    const timeWithSeconds = ref('')

    // Definição das colunas
    const columns = [
      { name: 'id', field: 'id', label: 'ID', sortable: true, align: 'left' },
      { name: 'action', field: 'action', label: 'Link/APP', sortable: true, align: 'left' },
      { name: 'link', field: 'link', label: 'Ação', sortable: true, align: 'left' },
      {
        name: 'inicialTime',
        field: 'inicialTime',
        label: 'Tempo incial',
        sortable: true,
        align: 'left',
        format: (val) => formatarDataColuna(val),
      },
      {
        name: 'finalTime',
        field: 'finalTime',
        label: 'Tempo final',
        sortable: true,
        align: 'left',
        format: (val) => formatarDataColuna(val),
      },
      {
        name: 'response',
        field: 'response',
        label: 'Resposta',
        sortable: true,
        align: 'center',
      },
      { name: 'actions', field: 'actions', label: 'Ações', align: 'right' },
    ]

    onMounted(() => {
      getAccounts()
      filteredAccounts.value = fingerPrints.value
    })

    // Função para buscar dados
    const getAccounts = async () => {
      try {
        const response = await api.get('fingerPrints')
        fingerPrints.value = response.data
        filteredAccounts.value = [...fingerPrints.value]
      } catch (error) {
        console.error(error)
      }
    }

    function formatarDataColuna(dataString) {
      // Dividir a string da data em partes (data e hora)
      const partesData = dataString.split(' ')
      const data = partesData[0].split('-')
      const hora = partesData[1]

      // Reorganizar as partes da data no formato desejado
      const dataFormatada = `${data[2]}/${data[1]}/${data[0]} - ${hora}`

      return dataFormatada
    }

    function removeAccount(id) {
      console.log(id)
    }

    function addAccount() {
      console.log('aa')
    }
    function updateAccount(id) {
      console.log(id)
    }

    const onHourInicialChange = () => {
      if (time.value) {
        const timInicial = new Date(time)
        const timFinal = new Date(time)

        timInicial.setHours(0, 0, 0, 0) // 00:00:00
        timFinal.setHours(23, 59, 59, 999) // 23:59:59

        filteredAccounts.value = fingerPrints.value.filter((biometric) => {
          const accountDate = new Date(biometric.inicialTime) // Extrair apenas a parte da data
          return accountDate >= timInicial && accountDate <= timFinal
        })
      } else {
        // Se não houver intervalo de datas, exibe todas as contas
        filteredAccounts.value = [...fingerPrints.value]
      }
    }

    // const onHourInicialChange = () => {
    //   // Se ambas as datas "from" e "to" estiverem definidas
    //   if (time) {
    //     const fromDate = new Date(time)
    //     const toDate = new Date(time)

    //     fromDate.setHours(0, 0, 0, 0) // 00:00:00
    //     toDate.setHours(23, 59, 59, 999) // 23:59:59

    //     // Aplicar o filtro para as contas
    //     filteredAccounts.value = accounts.value.filter((account) => {
    //       const accountDate = new Date(account.timestamp) // Extrair apenas a parte da data
    //       return accountDate >= fromDate && accountDate <= toDate
    //     })
    //   } else {
    //     // Se não houver intervalo de datas, exibe todas as contas
    //     filteredAccounts.value = [...accounts.value]
    //   }

    // Retorna variáveis e funções para o template
    return {
      fingerPrints,
      pagination,
      columns,
      filter: ref(''),
      filteredAccounts,
      onHourInicialChange,
      time,
      timeWithSeconds,
      removeAccount,
      addAccount,
      updateAccount,
    }
  },
})
</script>

<style>
.q-table {
  font-size: 20px;
}

.q-table td {
  font-size: 20px;
}
.q-table th {
  font-size: 20px;
}
</style>
