<script setup lang="ts">
import { Fancybox } from '@fancyapps/ui'
import '@fancyapps/ui/dist/fancybox/fancybox.css'

const props = defineProps<{
  options: any
}>()

const containerRef = ref<HTMLElement | null>(null)
const containerElement = toRef(containerRef, 'value')

onMounted(() => {
  Fancybox.bind(containerElement.value, '[data-fancybox]', {
    ...(props.options || {}),
  })
})

onUpdated(() => {
  Fancybox.unbind(containerElement.value)
  Fancybox.close()

  Fancybox.bind(containerElement.value, '[data-fancybox]', {
    ...(props.options || {}),
  })
})

onUnmounted(() => {
  Fancybox.destroy()
})
</script>

<template>
  <div ref="containerRef">
    <slot />
  </div>
</template>
