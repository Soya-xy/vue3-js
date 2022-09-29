import { api } from './ajax'

const noop = x => x

export function useMutate(data, name, options) {
  const { idField = 'id', total, before } = options || {}
  let { after } = options || {}
  const { onCreate, onUpdate, onRemove } = onMutate(data, idField)

  if (total && !after) {
    after = (output, action) => {
      switch (action) {
        case 'create':
          total.value++
          break
        case 'remove':
          total.value--
          break
      }
      return output
    }
  }

  const preprocess = typeof before === 'function' ? before : noop
  const postprocess = typeof after === 'function' ? after : noop

  return {
    create(input) {
      input = preprocess(input, 'create')
      if (input === false)
        return Promise.resolve()

      return api
        .post(name, input)
        .then(output => postprocess(output, 'create'))
        .then(onCreate)
    },
    update(input) {
      const id = input[idField]
      if (!id)
        throw new Error('缺少ID')

      input = preprocess(input, 'update')
      if (input === false)
        return Promise.resolve()

      return api
        .put(`${name}/${id}`, input)
        .then(output => postprocess(output, 'update'))
        .then(onUpdate)
    },
    remove(input) {
      input = preprocess(input, 'remove')
      if (input === false)
        return Promise.resolve()

      let ids = [input]
      if (Array.isArray(input)) {
        ids = input.map((x) => {
          if (typeof x === 'object')
            return x[idField]

          return x
        })
      }
      else if (typeof input === 'object') {
        ids = [input[idField]]
      }
      if (!ids.length || ids.some(x => !x))
        throw new Error('缺少ID')

      return api
        .delete(`${name}/${ids.join(',')}`)
        .then(output => postprocess(output, 'remove'))
        .then(onRemove(ids))
    },
  }
}

export function onMutate(data, idField = 'id') {
  return {
    onCreate(item) {
      data.value.push(item)
      return item
    },
    onUpdate(item) {
      const idx = data.value.findIndex(x => x[idField] === item[idField])
      if (idx >= 0) {
        data.value = [
          ...data.value.slice(0, idx),
          item,
          ...data.value.slice(idx + 1),
        ]
      }
      return item
    },
    onRemove(ids) {
      if (!Array.isArray(ids))
        ids = [ids]

      return (output) => {
        ids.forEach((id) => {
          const idx = data.value.findIndex(x => x[idField] === id)
          if (idx >= 0) {
            data.value = [
              ...data.value.slice(0, idx),
              ...data.value.slice(idx + 1),
            ]
          }
        })
        return output
      }
    },
  }
}
