declare module 'koa-art-template' {
    import Koa from 'koa'
    import { defaults } from 'art-template'
    function render(app: Koa, options: Partial<typeof defaults>): Middleware
    export default render

    declare module "Koa" {
        interface ExtendableContext {
            /** Properties values can be of any format; e.g. string, number, boolean, or even nested objects of these types */
            render: (template: string, properties?: { [name: string]: any }) => Promise<string>;
            throwJson: (status: number, message: any) => never;
        }
    }
}

declare interface TmplProps {
    page_title: string
    sub_title?: string
    data?: Record<string, any>
    [name: string]: any
}