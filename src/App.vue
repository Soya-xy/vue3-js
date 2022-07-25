<template>
  <router-view />
</template>

<script setup>
const theme = localStorage.getItem('theme') || 'dark'

if (theme)
  document.body.setAttribute('arco-theme', theme)

</script>
