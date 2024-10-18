import '@/styles/send.scss'
import Message from '@/scripts/utils/message'
import fetch from '@/scripts/utils/fetch'
import type { ErrorResponse, SendResponse } from '@/scripts/api'


document.addEventListener('DOMContentLoaded', () => {
    const sendBtn = document.getElementById('send')
    const [titleEl, contentEl] = ['title', 'content'].map(name => document.getElementsByName(name)?.[0] as HTMLInputElement | null)
    if (!sendBtn || !titleEl || !contentEl) {
        return Message.error('Failed to initialize the page')
    }

    let send_title_group = new Set<string>()
    sendBtn.addEventListener('click', async () => {
        if (send_title_group.size > 0 /* && send_title_group.has(titleEl.value.trim()) */) {
            return Message.warning('有一封信件正在发送，请稍后再试喵')
        }
        if (!titleEl.value.trim()) return Message.warning('标题不能为空哦')
        send_title_group.add(titleEl.value.trim())
        const r = await fetch('/api/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
                title: titleEl.value,
                content: contentEl.value
            })
        }).catch(e => Response.json({ error: e.message || e.toString() || '网络错误' }))
        const json = await r.clone().json().catch(() => { error: r.text() }) as SendResponse | ErrorResponse
        if (r.status !== 200) {
            send_title_group.delete(titleEl.value.trim())
            return Message.error((<ErrorResponse>json).error || '发件失败！')
        } else {
            send_title_group.delete(titleEl.value.trim())
            setTimeout(() => {
                window.location.href = `/box/${(<SendResponse>json).id}`
            }, 1000)
            return Message.success('发件成功！')
        }
    })
})