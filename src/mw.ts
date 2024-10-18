import type { Context, Next } from "koa";

export function ensureContentType(...match: string[]) {
    return (ctx: Context, next: Next) => {
        if (ctx.request.is(...match)) {
            return next();
        } else {
            ctx.throw(415);
        }
    }
}