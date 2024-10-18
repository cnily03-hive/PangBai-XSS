import '@/styles/letter.scss'
import Message from '@/scripts/utils/message'
import fetch from '@/scripts/utils/fetch'
import type { CallResponse } from '@/scripts/api'

document.addEventListener('DOMContentLoaded', async () => {
    const callBtn = document.getElementById('call')
    const id = document.querySelector('[data-id]')?.getAttribute('data-id')
    const error = document.querySelector('[data-error]')?.getAttribute('data-error')
    if (error) {
        Message.error(error)
    }
    if (!callBtn || !id) {
        return Message.error('Failed to initialize the page')
    }

    let on_calling = false
    callBtn.addEventListener('click', async () => {
        if (on_calling) {
            return Message.warning('当前正在提醒 PangBai 读信，请稍后再试喵')
        }
        on_calling = true
        const r = await fetch('/api/call', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({ id })
        }).catch(e => Response.json({ error: e.message || e.toString() || '网络错误' }))
        const json = await r.clone().json().catch(() => { error: r.text() }) as CallResponse
        if (r.status !== 200 || json.success !== true) {
            on_calling = false
            return Message.error(json.error || '提醒 PangBai 读信的过程中遇到不可抗力！')
        } else {
            on_calling = false
            return Message.success(json.message || 'PangBai 将会尽快阅读这份信件的呢')
        }
    })
})