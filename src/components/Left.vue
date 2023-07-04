<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { GetVh } from '~/composables'

const router = useRouter()
const showUpload = ref(false)
const showLeft = ref(true)
const fixedLeft = ref(false)

// 手机端 vh 适配
const appLeft = ref<HTMLElement | null>(null)
const vhSize = useCssVar('--vhSize', appLeft, { initialValue: GetVh() })

// 更新 vhSize
async function setVhSize(init = false) {
  vhSize.value = GetVh()
  if (init) {
    await nextTick()
    // ----------------------
    const elAppLeft = appLeft.value as HTMLElement
    elAppLeft.style.setProperty('--vhSize', vhSize.value)
  }
}

// 监听窗口大小变化
useEventListener(window, 'resize', () => {
  setVhSize()
})

// 展开/收起上传组件
function toggleUpload() {
  // 切换上传组件的显示状态
  showUpload.value = !showUpload.value
}

// 路由跳转
function goPath(path = '/') {
  router.push(path)
}

onMounted(() => {
  const breakpoints = useBreakpoints(breakpointsTailwind)
  const isMobile = breakpoints.smaller('sm')
  fixedLeft.value = isMobile.value
  if (isMobile.value)
    showLeft.value = false
  setVhSize(true)
})
</script>

<template>
  <div ref="appLeft" class="app-left border-right" :class="{ 'left-hide': !showLeft, 'left-fixed': fixedLeft }">
    <div class="header border-bottom">
      <div class="logo justify-content-center flex" title="Just Imgs" @click="goPath()">
        Just<span>Imgs</span>
      </div>
    </div>
    <div class="folder">
      <!-- 留空 -->
    </div>
    <!-- 固定在底部的菜单 -->
    <div class="boot-fixed border-top">
      <ul class="menu">
        <li><a href="javascript:;" @click="goPath('/')">首页</a></li>
        <li><a href="javascript:;" @click="toggleUpload()">上传</a></li>
        <li><a href="javascript:;" @click="goPath('/about')">关于</a></li>
        <li flex-row>
          <a grow href="javascript:;" icon-btn @click="toggleDark()"><span i-carbon-sun dark:i-carbon-moon /></a>
          <a grow href="javascript:;" icon-btn @click="showLeft = !showLeft"><span i-carbon-menu /></a>
        </li>
      </ul>
    </div>
    <!-- 固定在页面的切换侧栏按钮 -->
    <div v-show="!showLeft" class="menu-fixed">
      <a href="javascript:;" icon-btn @click="showLeft = !showLeft">
        <span i-carbon-menu />
      </a>
    </div>
  </div>
  <Upload :is-open="showUpload" />
</template>

<style lang="scss" scoped>
.app-left {
  --app-left-width: 200px;
  width: var(--app-left-width);
  min-width: var(--app-left-width);
  height: 100vh;

  .header {
    padding: 20px;
  }

  .logo {
    position: relative;
    font-size: 26px;
    font-weight: bolder;
    color: var(--text-def-color);
    margin-left: 5px;
    font-family: "Microsoft YaHei";
    cursor: pointer;

    span {
      background: var(--primary-color);
      color: #fff;
      border-radius: 4px;
      padding: 0px 4px;
      margin-left: 4px;
    }
  }

  .boot-fixed {
    position: absolute;
    bottom: 0;
    // 宽度为 --app-left-width 减去 1px 的边框宽度
    width: calc(var(--app-left-width) - 1px);
    background-color: var(--sec-bgColor);
  }

  .menu li {
    display: flex;
    margin-bottom: 7px;

    a {
      justify-content: center;
      text-align: center;
      color: var(--text-sec-color);
      background: var(--def-bgColor);
      border: var(--border-width) rgba(0, 0, 0, .07) solid;
      border-radius: 12px;

      &:hover {
        color: var(--text-def-color);
        background: var(--hover-bgColor);
      }
    }
  }

  &.left-hide {
    position: fixed;
    left: calc(-1 * var(--app-left-width));
  }

  &.left-fixed {
    position: fixed;
    z-index: 13;
    transition: height .3s ease-in-out;
    background-color: var(--def-bgColor);
    height: calc(var(--vhSize, 1vh) * 100);
  }

  &.left-hide .menu-fixed {
    left: 0;
  }

  .menu-fixed {
    position: fixed;
    bottom: 0px;
    z-index: 13;
    left: var(--app-left-width);
    color: var(--text-def-color);
    border-radius: 4px;
    margin-left: 4px;
    margin-top: 4px;

    a:hover {
      color: var(--text-sec-color);
      background: var(--hover-bgColor);
    }

    span {
      display: block;
      width: 37px;
      height: 37px;
    }
  }

}
</style>
