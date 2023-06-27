<script setup lang="ts">
const router = useRouter()
const showUpload = ref(false)
function toggleUpload() {
  // 切换上传组件的显示状态
  showUpload.value = !showUpload.value
}
function goPath(path = '/') {
  router.push(path)
}
</script>

<template>
  <div class="app-left border-right">
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
        <li>
          <a href="javascript:;" icon-btn @click="toggleDark()"><span i-carbon-sun dark:i-carbon-moon /></a>
        </li>
      </ul>
    </div>
  </div>
  <Upload :is-open="showUpload" />
</template>

<style lang="scss" scoped>
.app-left {
  --app-left-width: 200px;
  width: var(--app-left-width);
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

}
</style>
