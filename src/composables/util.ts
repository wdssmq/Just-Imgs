export function GetFileSize(size: number): string {
  if (!size)
    return ''

  const units = ['b', 'KB', 'M', 'G', 'T']
  const num = 1024

  let i = 0
  while (size >= num && i < units.length - 1) {
    size /= num
    i++
  }

  return `${size.toFixed(2)} ${units[i]}`
}

// localStorage 封装
export const lsObj = {
  setItem(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value))
  },
  getItem(key: string, def: string | any = '') {
    const item = localStorage.getItem(key)
    if (item)
      return JSON.parse(item)

    return def
  },
  // 保存登录信息
  saveLogin(user: string, pass: string) {
    const loginInfo = {
      user,
      pass,
    }
    this.setItem('loginInfo', loginInfo)
  },
  // 读取登录信息
  getLogin() {
    return this.getItem('loginInfo', {
      user: '',
      pass: '',
    })
  },
}
