import Router from 'koa-router'
import { Memory, type Letter } from './letter'

const router = new Router()

router.get('/', async (ctx, next) => {
    await ctx.render('index', <TmplProps>{
        page_title: 'PangBai 过家家 (5)',
    })
})

router.get('/send', async (ctx, next) => {
    await ctx.render('send', <TmplProps>{
        page_title: 'PangBai 过家家 (5)',
        sub_title: '发信',
    })
})

const HINT_BOX = [
    '就像是一场梦……'
]

router.get('/box', async (ctx, next) => {
    const letters: { id: string, title: string }[] = []
    for (const [id, { title }] of Memory) {
        letters.push({ id, title })
    }
    await ctx.render('box', <TmplProps>{
        page_title: 'PangBai 过家家 (5)',
        sub_title: '信箱',
        letters: letters,
        hint_text: HINT_BOX[Math.floor(Math.random() * HINT_BOX.length)]
    })
})

const HINT_LETTERS = [
    '愿此去，莫忘归',
    '相见时难别亦难，东风无力百花残',
    '此去经年，应是良辰好景虚设',
    '终有一天，人类一定能战胜崩坏！'
]

const html = (strings: TemplateStringsArray, ...values: any[]) => { return strings.reduce((acc, str, i) => acc + str + (values[i] || ''), '') }
const TITLE_EMPTY = html`<span style="text-align: center; color: #d9cac5; display: inline-block; width: 100%; -moz-user-select: none; -webkit-user-select: none; user-select: none;">空空如也～</span>`
const CONTENT_EMPTY = html`<span style="text-align: center; color: #d9cac5; display: grid; width: 100%; height: 100%; place-items: center; -moz-user-select: none; -webkit-user-select: none; user-select: none;"><span>空空如也～</span></span>`

function safe_html(str: string) {
    return str
        .replace(/<.*>/igm, '')
        .replace(/<\.*>/igm, '')
        .replace(/<.*>.*<\/.*>/igm, '')
}

router.get('/box/:id', async (ctx, next) => {
    const letter = Memory.get(ctx.params['id'])
    await ctx.render('letter', <TmplProps>{
        page_title: 'PangBai 过家家 (5)',
        sub_title: '查看信件',
        id: ctx.params['id'],
        hint_text: HINT_LETTERS[Math.floor(Math.random() * HINT_LETTERS.length)],
        data: letter ? {
            title: safe_html(letter.title),
            content: safe_html(letter.content)
        } : { title: TITLE_EMPTY, content: CONTENT_EMPTY },
        error: letter ? null : '找不到该信件'
    })
})

export default router