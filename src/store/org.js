import { api } from '~/util/ajax'
import { useMutate } from '~/util/mutate'

export const orgs = ref([])
export const orgCount = ref(0)

export function getOrgs(params) {
  return api.get('org', { params }).then((res) => {
    orgs.value = res.data
    orgCount.value = res.total
    return res
  })
}

export const mutation = useMutate(orgs, 'org', { total: orgCount })
