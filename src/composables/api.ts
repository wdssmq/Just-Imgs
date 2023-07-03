/* eslint-disable @typescript-eslint/no-this-alias */

// useFetch | VueUse中文文档
// http://www.vueusejs.com/core/useFetch/

class Api {
  urlBase = import.meta.env.VITE_CF_WORKER_URL
  user = ''
  pass = ''
  constructor() {
    // console.log(this.urlBase)
  }

  // 设置用户信息
  setUser(user: string, pass: string) {
    this.user = user
    this.pass = pass
    return this
  }

  // 上传图片
  async upload(data: { name: string; body: string }) {
    const self = this
    const url = `${self.urlBase}upload`
    data.body = data.body.replace(/data:image\/[^;]+;base64,/, '')

    const { error, data: resData } = await useFetch(url, {
      // credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(`${self.user}:${self.pass}`)}`,
      },
      method: 'PUT',
      body: JSON.stringify(data),
      // afterFetch: ctx => self.afterFetch(ctx, 'upload'),
    }).json()
    return { error, data: resData }
  }

  // 获取列表
  async list(hash = '') {
    const self = this
    const url = `${self.urlBase}?hash=${hash}`
    const { data } = await useFetch(url, {
      afterFetch: ctx => self.afterFetch(ctx),
    }).get().json()
    return data
  }

  // 拼接对象地址，参数为 key
  conatct(key: string) {
    // 转义 / 为 %2F
    key = key.replace(/\//g, '%2F')
    return `${this.urlBase}${key}`
  }

  // 处理返回数据
  afterFetch(ctx: { data: any; response: any }, type = 'list') {
    const self = this
    const { data, response } = ctx
    if (response.ok) {
      if (type === 'list') {
        ctx.data.data = data.data.map((item: any) => {
          return {
            url: self.conatct(item.key),
            ...item,
          }
        })
      }
    }
    return ctx
  }
}

export const api = new Api()
