import dayjs from 'dayjs'
import { Toast } from 'vant'
import Clipboard from 'clipboard'

const DEFAULT_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'

export function formatTime(t, fmt) {
  return t ? dayjs(t).format(fmt || DEFAULT_TIME_FORMAT) : ''
}

export const copyText = (el) => {
  const clipboard = new Clipboard(el)
  clipboard.on('success', () => {
    Toast('复制成功')
    clipboard.destroy()// 释放内存
  })
  clipboard.on('error', () => {
    Toast('该浏览器不支持自动复制')
    clipboard.destroy()// 释放内存
  })
}
