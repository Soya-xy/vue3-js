import { api } from '~/util/ajax'
import { useMutate } from '~/util/mutate'

export const accounts = ref([])
export const accountCount = ref(0)

export function getAccounts(params) {
  return api.get('account', { params }).then((res) => {
    accounts.value = res.data
    accountCount.value = res.total
    return res
  })
}

export function resetPassword(id) {
  if (typeof id === 'object') id = id.id
  return api.put(`account/${id}/reset`)
}

export const mutation = useMutate(accounts, 'account', { total: accountCount })
