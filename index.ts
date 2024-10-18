import Koa from 'koa'
import path from 'path'
import bodyParser from 'koa-bodyparser'
import _static from 'koa-static'
import render from 'koa-art-template'

import routePage from '@/page'
import routeApi from '@/api'


const app = new Koa()

render(app, {
    root: path.join(import.meta.dirname, 'views'),
    extname: '.html',
    debug: process.env.NODE_ENV?.trim() === 'development',
});

app.use(bodyParser({
    enableTypes: ['json', 'form', 'text'],
    onerror: function (err, ctx) {
        ctx.throw('body parse error', 422)
    }
}))

class HTTPJsonError extends Error {
    status: number
    expose: boolean = true
    constructor(status: number, message: any) {
        super(JSON.stringify(typeof message === 'object' ? message : { error: message }))
        this.status = status
        this.expose = true
    }
}

app.use((ctx, next) => {
    ctx.throwJson = (status: number, message: any) => {
        throw new HTTPJsonError(status, message)
    }
    return next().catch((err) => {
        if (err instanceof HTTPJsonError) {
            ctx.status = err.status
            ctx.body = err.message
            ctx.set('Content-Type', 'application/json; charset=utf-8')
        }
        else ctx.app.emit('error', err, ctx)
    })
})

app.use(routePage.routes())
app.use(routeApi.routes())

app.use(_static(path.join(import.meta.dirname, 'public')))

app.listen(3000, () => {
    console.log(`Server is listening on port ${3000}`)
})