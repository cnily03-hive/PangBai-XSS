import '@/styles/box.scss'

document.addEventListener('DOMContentLoaded', async () => {
    document.querySelectorAll('ul > li').forEach(li => {
        li.addEventListener('click', () => {
            li.querySelector('a')?.click()
        })
    })
})