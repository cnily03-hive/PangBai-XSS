const html = (strings: TemplateStringsArray, ...values: any[]) => { return strings.reduce((acc, str, i) => acc + str + (values[i] || ''), '') }

const ICON_MAP = {
    'success': html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="currentColor" d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896m-55.808 536.384-99.52-99.584a38.4 38.4 0 1 0-54.336 54.336l126.72 126.72a38.272 38.272 0 0 0 54.336 0l262.4-262.464a38.4 38.4 0 1 0-54.272-54.336z"></path></svg>`,
    'warning': html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="currentColor" d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896m0 192a58.432 58.432 0 0 0-58.24 63.744l23.36 256.384a35.072 35.072 0 0 0 69.76 0l23.296-256.384A58.432 58.432 0 0 0 512 256m0 512a51.2 51.2 0 1 0 0-102.4 51.2 51.2 0 0 0 0 102.4"></path></svg>`,
    'info': html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="currentColor" d="M512 64a448 448 0 1 1 0 896.064A448 448 0 0 1 512 64m67.2 275.072c33.28 0 60.288-23.104 60.288-57.344s-27.072-57.344-60.288-57.344c-33.28 0-60.16 23.104-60.16 57.344s26.88 57.344 60.16 57.344M590.912 699.2c0-6.848 2.368-24.64 1.024-34.752l-52.608 60.544c-10.88 11.456-24.512 19.392-30.912 17.28a12.992 12.992 0 0 1-8.256-14.72l87.68-276.992c7.168-35.136-12.544-67.2-54.336-71.296-44.096 0-108.992 44.736-148.48 101.504 0 6.784-1.28 23.68.064 33.792l52.544-60.608c10.88-11.328 23.552-19.328 29.952-17.152a12.8 12.8 0 0 1 7.808 16.128L388.48 728.576c-10.048 32.256 8.96 63.872 55.04 71.04 67.84 0 107.904-43.648 147.456-100.416z"></path></svg>`,
    'error': html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="currentColor" d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896m0 393.664L407.936 353.6a38.4 38.4 0 1 0-54.336 54.336L457.664 512 353.6 616.064a38.4 38.4 0 1 0 54.336 54.336L512 566.336 616.064 670.4a38.4 38.4 0 1 0 54.336-54.336L566.336 512 670.4 407.936a38.4 38.4 0 1 0-54.336-54.336z"></path></svg>`
}

const COLOR_PAIR = {
    'success': ['#67c23a', '#f0f9eb', '#e1f3d8'],
    'warning': ['#e6a23c', '#fdf6ec', '#faecd8'],
    'info': ['#909399', '#f4f4f5', '#e9e9eb'],
    'error': ['#f56c6c', '#fef0f0', '#fde2e2']
}

const MSG_TMPL = html`
<div class="message">
    <div class="message__content">
        {{ icon_html }}<p class="message__text">{{ message }}</p>
    </div>
</div>
`

const FADE_DURATION = 350

let mutex = 0

interface VarProps {
    '--message-background-color': string
    '--message-font-color': string
    '--message-border-style'?: string // default is solid
    '--message-border-color'?: string // default is none
    '--message-box-shadow'?: string // default will show the box-shadow
}

function getVarProps(type: string, is_plain: boolean = false): VarProps {
    if (!Object.prototype.hasOwnProperty.call(COLOR_PAIR, type)) { type = 'info' }
    const t = type as keyof typeof COLOR_PAIR
    const r = <VarProps>{
        '--message-background-color': is_plain ? '#fff' : COLOR_PAIR[t][1],
        '--message-font-color': COLOR_PAIR[t][0],
    }
    if (is_plain) {
        r["--message-border-style"] = 'none'
    } else {
        r["--message-border-color"] = COLOR_PAIR[t][2]
        r["--message-box-shadow"] = 'none'
    }
    return r
}

function createMessageBox() {
    const box = document.createElement('div')
    box.classList.add('message-box')
    document.body.appendChild(box)
    return box
}

function getMessageBox() {
    const box = document.querySelector('.message-box')
    if (box) return box
    return createMessageBox()
}

function createMessage(message: string, type: string = 'info') {
    const m = document.createElement('div')
    m.classList.add('message__layer', ...type ? [`message__type--${type}`] : [])

    // set --message-* properties
    Object.entries(getVarProps(type)).forEach(([k, v]) => {
        m.style.setProperty(k, v)
    })

    // set icon
    let icon_html = ''
    if (type && Object.prototype.hasOwnProperty.call(ICON_MAP, type)) {
        const i = document.createElement('i')
        i.innerHTML = ICON_MAP[type as keyof typeof ICON_MAP]
        i.classList.add('message__icon')
        icon_html = i.outerHTML
    }

    m.innerHTML = MSG_TMPL
        .replace(/{{\s*message\s*}}/g, escapeText(message))
        .replace(/{{\s*icon_html\s*}}/g, icon_html)
    return m
}

function escapeText(text: string) {
    const div = document.createElement('div')
    div.appendChild(document.createTextNode(text))
    return div.innerHTML
}


interface MessageOptions {
    message: string
    duration?: number
    type?: 'success' | 'warning' | 'info' | 'error',
    plain?: boolean
}

const default_options: Required<MessageOptions> = {
    message: '',
    duration: 3000,
    type: 'info',
    plain: false
}

function message(options: MessageOptions): Promise<boolean> {
    const opts: Required<MessageOptions> = Object.assign({}, default_options, options)
    ++mutex
    const box = getMessageBox()
    const mlayer = createMessage(opts.message, opts.type)
    mlayer.style.setProperty('--fade-duration', `${FADE_DURATION}ms`)
    box.appendChild(mlayer)
    --mutex
    return new Promise(async (resolve: (value: boolean) => void) => {
        await new Promise((resolve) => setTimeout(resolve, FADE_DURATION))
        const height = mlayer.children[0].clientHeight
        mlayer.style.setProperty('--height', `${height}px`)
        await new Promise((resolve) => setTimeout(resolve, opts.duration))
        mlayer.classList.add('message__layer--fade-out')
        setTimeout(() => {
            mlayer.remove()
            resolve(true)
            if (mutex === 0 && box.children.length === 0) {
                box.remove()
            }
        }, FADE_DURATION + 100)
    }).catch(() => false)
}

// create callable object: Message

function Message(options: string): Promise<boolean>
function Message(options: MessageOptions): Promise<boolean>
function Message(options: string | MessageOptions): Promise<boolean> {
    if (typeof options === 'string') {
        options = { message: options }
    }
    return message(options)
}

function createAlias(type: string) {
    return function (msg: string, options: number | Omit<MessageOptions, 'type' | 'message'> = {}): Promise<boolean> {
        if (typeof options === 'number') { options = { duration: options } }
        return message(Object.assign({}, options, { message: msg, type }) as Required<MessageOptions>)
    }
}

Message.success = createAlias('success')
Message.warning = createAlias('warning')
Message.info = createAlias('info')
Message.error = createAlias('error')

type MessageAlias = {
    (msg: string, duration?: number): Promise<boolean>
    (msg: string, options: Omit<MessageOptions, 'type' | 'message'>): Promise<boolean>
}

interface Message {
    (msg: string): Promise<boolean>
    (options: MessageOptions): Promise<boolean>
    success: MessageAlias
    warning: MessageAlias
    info: MessageAlias
    error: MessageAlias
}

export default Message as Message