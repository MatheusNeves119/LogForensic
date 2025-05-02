<template>
  <q-page padding style="font-weight: 50px">
    <div class="q-pa-md">
      <div class="col-12" style="padding: 6px; color: #007bff">
        <q-btn class="load-button" label="Adicionar" @click="addAccount"></q-btn>
      </div>
      <q-table
        style="height: auto"
        flat
        bordered
        title="Acesso de Contas"
        :rows="filteredAccounts"
        :columns="columns"
        row-key="index"
        virtual-scroll
        v-model:pagination="pagination"
        :rows-per-page-options="[0]"
        :filter="filter"
      >
        <template v-slot:top-right>
          <div class="row items-center">
            <div class="col-2">
              <q-icon name="event" class="cursor-pointer" style="font-size: 30px; color: #007bff">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="dateRange" range @update:model-value="onDateRangeChange">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Fechar" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </div>
            <div class="col-10">
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
  </q-page>
</template>

<script>
import { ref, defineComponent, onMounted } from 'vue'
import { api } from 'boot/axios'

export default defineComponent({
  name: 'IndexPage',

  setup() {
    // Variáveis reativas
    const accounts = ref([])
    const pagination = ref({
      rowsPerPage: 10,
    })

    const filteredAccounts = ref([])
    const dateRange = ref({ from: null, to: null })
    const hourRange = ref({ from: null, to: null })

    // Definição das colunas
    const columns = [
      { name: 'id', field: 'id', label: 'ID', sortable: true, align: 'left' },
      { name: 'accountId', field: 'accountId', label: 'ID Conta', sortable: true, align: 'left' },
      { name: 'uid', field: 'uid', label: 'UID', sortable: true, align: 'left' },
      { name: 'key', field: 'key', label: 'Chave', sortable: true, align: 'left' },
      {
        name: 'actionType',
        field: 'actionType',
        label: 'Tipo Ação',
        sortable: true,
        align: 'left',
        format: (val) => formatarTipoAcao(val),
      },
      {
        name: 'timestamp',
        field: 'timestamp',
        label: 'Data',
        sortable: true,
        align: 'left',
        format: (val) => formatarDataColuna(val),
      },
      { name: 'actions', field: 'actions', label: 'Ações', align: 'right' },
    ]

    onMounted(() => {
      getAccounts()
      filteredAccounts.value = accounts.value
    })

    // Função para buscar dados
    const getAccounts = async () => {
      try {
        const response = await api.get('accounts')
        accounts.value = response.data
        filteredAccounts.value = [...accounts.value]
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

    // function formatarData(dataString) {
    //   // Dividir a string da data em partes (data e hora)
    //   const partesData = dataString.split(' ')
    //   const data = partesData[0].split('-')

    //   // Reorganizar as partes da data no formato desejado
    //   const dataFormatada = `${data[0]}/${data[1]}/${data[2]}`

    //   return dataFormatada
    // }

    function removeAccount(id) {
      console.log(id)
    }

    function addAccount() {
      console.log('aa')
    }
    function updateAccount(id) {
      console.log(id)
    }

    const onDateRangeChange = () => {
      // Se ambas as datas "from" e "to" estiverem definidas
      if (dateRange.value.from && dateRange.value.to) {
        const fromDate = new Date(dateRange.value.from)
        const toDate = new Date(dateRange.value.to)

        fromDate.setHours(0, 0, 0, 0) // 00:00:00
        toDate.setHours(23, 59, 59, 999) // 23:59:59

        // Aplicar o filtro para as contas
        filteredAccounts.value = accounts.value.filter((account) => {
          const accountDate = new Date(account.timestamp) // Extrair apenas a parte da data
          return accountDate >= fromDate && accountDate <= toDate
        })
      } else {
        // Se não houver intervalo de datas, exibe todas as contas
        filteredAccounts.value = [...accounts.value]
      }
    }
    const onHourRangeChange = () => {
      // Se ambas as datas "from" e "to" estiverem definidas
      if (hourRange.value.from && hourRange.value.to) {
        const fromDate = new Date(hourRange.value.from)
        const toDate = new Date(hourRange.value.to)

        // Aplicar o filtro para as contas
        filteredAccounts.value = accounts.value.filter((account) => {
          const accountHour = new Date(account.timestamp.split(' ')[0]) // Extrair apenas a parte da data
          return accountHour >= fromDate && accountHour <= toDate
        })
      } else {
        // Se não houver intervalo de datas, exibe todas as contas
        filteredAccounts.value = [...accounts.value]
      }
    }

    function formatarTipoAcao(tipoAcao) {
      if (tipoAcao) {
        switch (tipoAcao) {
          case 'action_called_account_remove':
            return 'Chamada para remover conta'
          case 'action_called_account_add':
            return 'Chamada para adicionar conta'
          case 'action_account_add':
            return 'Ação de adicionar conta'
          case 'action_set_password':
            return 'Ação alterar senha'
          case 'action_account_remove':
            return 'Ação de remover conta'
          case 'action_authenticator_remove':
            return 'Ação de remover autenticação'
          case 'action_sync_de_ce_accounts':
            return 'Ação de syncronização entre contas'

          default:
            return 'Ação não identificada'
        }
      } else {
        return 'Ação não identificada'
      }
    }

    // Retorna variáveis e funções para o template
    return {
      accounts,
      pagination,
      columns,
      filter: ref(''),
      dateRange,
      onDateRangeChange,
      filteredAccounts,
      hourRange,
      onHourRangeChange,
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
