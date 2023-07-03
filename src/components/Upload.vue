<script setup lang="ts">
import uploadSvg from '~/assets/svg/upload.svg?raw'
import { GetFileSize } from '~/composables'

const props = defineProps<{
  isOpen: boolean
}>()

// 为 UploadImage 定义类型
interface UploadImage {
  name: string
  size: number
  sizeStr: string
  type: string
  base64: string
  folder: string
}

const upload_list = ref<UploadImage[]>([])
const upload_loading = ref(false)
// login 组件实例
const loginRef = ref()

// const is_login = ref(false)
// const loginInfo = lsObj.getLogin()
// if (loginInfo.user && loginInfo.pass)
//   is_login.value = true

// 添加图片到上传列表
async function uploadAdd(files: FileList) {
  upload_loading.value = true
  const upload_list_new: UploadImage[] = []
  const promises = []
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const folder = file.webkitRelativePath?.split('/')[0]
    const promise = new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (e) => {
        const base64 = e?.target?.result
        const image: UploadImage = {
          name: file.name,
          size: file.size,
          sizeStr: GetFileSize(file.size),
          type: file.type,
          base64: base64 as string,
          folder,
        }
        resolve(image)
      }
      reader.onerror = reject
    })
    promises.push(promise)
  }

  try {
    const images = await Promise.all(promises) as UploadImage[]
    // console.log(images)
    upload_list_new.push(...images)
    upload_list.value = [...upload_list.value, ...upload_list_new]
  }
  catch (error) {
    console.error(error)
  }
  finally {
    upload_loading.value = false
    // console.log(upload_list.value)
  }
}

// 选择文件或文件夹后触发
function uploadPicked(e: Event) {
  const input = e.target as HTMLInputElement
  const files = input.files
  if (!files)
    return
  uploadAdd(files)
  const { isLogin } = loginRef.value.loginInfo
  // 未登录则提示
  if (!isLogin)
    alert('请先设置用户名和密码')
}

// 上传单个图片
function uploadImage(image: UploadImage, e: Event) {
  const button = e.target as HTMLButtonElement
  // 登录信息获取
  loginRef.value.checkLogin()
  const { user, pass, isLogin } = loginRef.value.loginInfo
  // 未登录则提示
  if (!isLogin) {
    button.innerText = '请先设置用户名和密码'
    return
  }

  button.disabled = true
  button.innerText = '上传中...'
  upload_loading.value = true
  const data = {
    name: image.name,
    body: image.base64,
  }

  api.setUser(user, pass).upload(data).then(({ data }) => {
    if (data.value?.ok) {
      button.innerText = '已上传'
      lsObj.saveTimestamp()
    }

    else { button.innerText = data.value?.msg || '上传失败' }
    upload_loading.value = false
  })
}

// 封装一个函数，用于拼接待上传图片的信息
function getUploadImageInfo(item: UploadImage) {
  return `${item.folder} / ${item.name} / ${item.sizeStr}`.replace(/^[\s/]+/, '')
}
</script>

<template>
  <div class="upload-modal sec-bgColor border-right" :class="{ isOpen: props.isOpen }">
    <div
      class="upload-area def-bgColor relative" :class="{
        isLoading: upload_loading,
      }"
    >
      <label class="upload-box file flex flex-col items-center justify-center">
        <div class="upload-icon" v-html="uploadSvg" />
        点击或拖拽文件到此处上传
        <input type="file" class="upload-file" name="upload-file" accept="image/*" multiple hidden @change="uploadPicked">
      </label>
      <hr class="border-top">
      <label class="upload-box folder button" flex items-center justify-center>
        上传文件夹
        <input
          type="file" class="upload-folder" name="upload-folder" webkitdirectory webkitrelativepath hidden
          @change="uploadPicked"
        >
      </label>
      <div :class="{ loading: upload_loading }" />
    </div>
    <div class="upload-list">
      <div v-show="upload_list.length > 0" class="upload-title">
        待上传图片
      </div>
      <div v-for="item in upload_list" :key="item.name" class="upload-item flex justify-between p-3">
        <div class="info-wrap flex flex-col justify-center">
          <div class="info" v-text="getUploadImageInfo(item)" />
          <div class="act">
            <button class="text-sm btn" @click="uploadImage(item, $event)">
              上传
            </button>
          </div>
        </div>
        <div class="view">
          <img :src="item.base64" class="image" :title="`${item.name} / ${item.sizeStr}`">
        </div>
      </div>
    </div>
    <Login ref="loginRef" />
  </div>
</template>

<style lang="scss" scoped>
.upload-modal {
  display: none;
  max-width: 500px;
  width: 29%;
  // width: 500px;
  height: 100vh;
  padding: 28px 14px;
  overflow: hidden;
  transition: all .15s;

  &.isOpen {
    display: block;
  }

  .upload-area {
    box-sizing: border-box;
    border-radius: 12px;
    border: 3px dashed var(--border-color);
    color: var(--text-sec-color);
    transition: all .15s;

    &:hover {
      border: 3px dashed var(--primary-color);
    }

    .upload-box {
      cursor: pointer;

      &:hover {
        color: var(--primary-color);
      }

      &.file {
        height: var(--upload-height);
      }

      &.folder {
        height: 2.3em;
      }
    }

    .upload-icon {
      width: 80px;
      height: 80px;
    }
  }

  .upload-title {
    color: var(--text-sec-color);
    margin: 30px 0 10px 10px;
    font-size: 14px;
  }

  .upload-item {
    color: var(--text-sec-color);
    border-radius: 12px;
    background: var(--def-bgColor);
    margin-bottom: 7px;
    height: 70px;
    border: var(--border-width) solid var(--border-color);

    .view img {
      height: 100%;
    }
  }

}

.upload-area.isLoading {
  display: flex;
  justify-content: center;
  height: var(--upload-height);
  color: var(--primary-color);

  .upload-box {
    display: none;
  }

}
</style>
