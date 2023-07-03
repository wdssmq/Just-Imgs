<script setup lang="ts">
interface ImageItem {
  url: string
  key: string
  size: number
}
const images_list = ref({
  data: [] as ImageItem[],
})

function GetList() {
  const hash = lsObj.getTimestamp().toString(36)
  api.list(hash).then((res) => {
    // console.log(res.value)
    images_list.value = res.value
  })
}
GetList()

function CopyText() {

}
function GetMarkdownText(url: string, text: string) {
  return `![${text}](${url}, "${text}")`
}
</script>

<template>
  <Fancybox :options="{
    Carousel: {
      infinite: false,
    },
  }" :class="'img-list'">
    <div v-for="item in images_list.data" :key="`${item.key}`" class="img-item flex flex-col items-center justify-center">
      <a class="img-image" data-fancybox="gallery" :href="item.url" :title="item.key"><img :src="item.url" :title="item.key" :alt="item.key"></a>
      <div class="img-info">
        <div class="key">
          {{ item.key }}
        </div>
        <div class="copy-box">
          <span class="copy-btn" :data-clipboard-text="GetMarkdownText(item.url, item.key)"
            @click="CopyText()">Markdown</span>
          <span class="copy-btn" :data-clipboard-text="item.url" @click="CopyText()">Url</span>
        </div>
      </div>
    </div>
  </Fancybox>
</template>

<style lang="scss" scoped>
.img-list {
  --img-item-width: 207px;
  --img-item-height: 207px;
  --img-list-gap: 29px;
  display: grid;
  padding: var(--img-list-gap);
  grid-gap: var(--img-list-gap);
  min-height: var(--img-item-height);
  grid-template-columns: repeat(auto-fill, minmax(var(--img-item-width), 1fr));

  .img-item {
    color: var(--text-sec-color);
  }

  .img-image img {
    max-height: var(--img-item-height);
  }

  .img-info .copy-box {
    display: none;
  }
}
</style>
