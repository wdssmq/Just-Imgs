<script lang="ts" setup>
import { lsObj } from '~/composables'

const loginInfo = reactive({
  user: '',
  pass: '',
  isLogin: false,
})

function checkLogin() {
  const { user, pass } = lsObj.getLogin()
  if (user && pass) {
    loginInfo.user = user
    loginInfo.pass = pass
    // loginInfo.isLogin = true
  }
  else {
    loginInfo.isLogin = false
  }
  // console.log('checkLogin', loginInfo)
}

checkLogin()

function Login(e: Event) {
  const button = e.target as HTMLButtonElement
  if (!loginInfo.user || !loginInfo.pass) {
    button.innerText = '用户名或密码不能为空'
    return
  }

  lsObj.saveLogin(loginInfo.user, loginInfo.pass)
  button.innerText = '已保存'
  setTimeout(() => {
    loginInfo.isLogin = true
    button.innerText = '保存'
  }, 2000)
}

defineExpose({
  checkLogin,
  loginInfo,
})
</script>

<template>
  <div class="form-control" :class="{ hidden: loginInfo.isLogin }">
    <!-- 用户名 -->
    <label class="label" for="user">
      <span class="label-text">用户名</span>
    </label>
    <input
      v-model="loginInfo.user" type="text" name="user" placeholder="usr"
      class="w-full-x input input-bordered input-md"
    >
    <!-- 密码 -->
    <label class="label" for="pass">
      <span class="label-text">密码</span>
    </label>
    <input
      v-model="loginInfo.pass" type="password" name="pass" placeholder="pwd"
      class="w-full-x input input-bordered input-md"
    >
    <!-- 登录 -->
    <label class="label" for="login">
      <span class="label-text">保存</span>
    </label>
    <button type="button" class="btn-sm btn" name="login" @click="Login($event)">
      保存
    </button>
  </div>
</template>

<style lang="scss" scoped>
.form-control {
  color: var(--text-sec-color);
}
</style>
