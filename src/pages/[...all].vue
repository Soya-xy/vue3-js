<script setup>
const route = useRoute()
const router = useRouter()
</script>

<template>
  <div flex items-center justify-center h-full>
    <div>
      <a-alert type="warning">
        <template #title>
          {{ route.path }}
        </template>
        掌门下山走丢了，至今未归呀~
        <template #action>
          <a-button type="text" @click="router.back">
            返回
          </a-button>
        </template>
      </a-alert>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: empty
</route>
