import Router from "koa-router";
import { Memory } from "./letter";
import { ensureContentType } from "./mw";
import { v4 as uuid } from "uuid";
import visit from "./bot";

const api = new Router({ prefix: '/api' });

interface SubmitRequest {
    title: string
    content: string
}

api.post('/send',
    ensureContentType('application/json'),
    async (ctx, next) => {
        const { title, content } = <Partial<SubmitRequest>>ctx.request.body;
        if (typeof title !== 'string' || typeof content !== 'string') {
            return ctx.throwJson(400, '缺失标题或内容');
        }
        if (title.trim() === '') {
            return ctx.throwJson(400, '标题不能为空');
        }
        if (title.length > 50) {
            return ctx.throwJson(400, '标题太长了呢，最多只能 50 个字哦 >_<');
        }
        if (content.length > 500) {
            return ctx.throwJson(400, '内容太长了呢，超过 500 字 PangBai 可能读不过来呢');
        }
        let id = uuid()
        if (Memory.has(id)) {
            return ctx.throwJson(500, '奇怪，这份信件已经存在了呢');
        }
        Memory.set(id, { title, content });
        return ctx.body = { id };
    }
);

api.post('/call',
    ensureContentType('application/json'),
    async (ctx, next) => {
        const { id } = <Partial<{ id: string }>>ctx.request.body;
        if (typeof id !== 'string') {
            return ctx.throwJson(400, '这好像不是信件吧');
        }
        if (!Memory.has(id)) {
            return ctx.throwJson(404, '这份信件并不存在呢');
        }
        let url = `http://localhost:3000/box/${id}`
        let ret = await visit(url);
        if (!ret) {
            return ctx.throwJson(500, { success: ret, visit: url, error: 'PangBai 在阅读信件时似乎出了点问题呢' });
        }
        return ctx.body = {
            success: ret,
            visit: url,
            message: 'PangBai 将会立即阅读这份信件'
        };
    }
)

export default api;