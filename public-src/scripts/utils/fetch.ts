export default function fetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
    if (window.fetch) return window.fetch(input, init)
    if (typeof input === 'string') {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest()
            xhr.open(init?.method || 'GET', input, true)
            xhr.responseType = 'text'
            if (init?.headers) {
                if (Array.isArray(init.headers)) {
                    init.headers.forEach(([k, v]) => {
                        xhr.setRequestHeader(k, v)
                    })
                } else if (init.headers instanceof Headers) {
                    init.headers.forEach((v, k) => {
                        xhr.setRequestHeader(k, v)
                    })
                } else {
                    Object.entries(init.headers).forEach(([k, v]) => {
                        xhr.setRequestHeader(k, v)
                    })
                }
            }
            xhr.onerror = () => {
                reject(xhr)
            }
            xhr.onload = () => {
                let rawHeaderText = xhr.getAllResponseHeaders()
                let headers = new Headers()
                let has_header = false
                rawHeaderText.split(/\r\n/).forEach(line => {
                    let m = line.match(/^([^:]+): (.*)$/)
                    if (!m || m.length < 3) return
                    headers.set(m[1], m[2])
                    has_header = true
                })
                resolve(new Response(xhr.responseText, {
                    status: xhr.status,
                    statusText: xhr.statusText,
                    headers: has_header ? headers : undefined
                }))
            }
            xhr.send(init?.body as any)
        })
    } else {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest()
            xhr.open(input.method || 'GET', input.url, true)
            xhr.responseType = 'text'
            Object.entries(input.headers).forEach(([k, v]) => {
                xhr.setRequestHeader(k, v)
            })
            xhr.onerror = () => {
                reject(xhr)
            }
            xhr.onload = () => {
                let rawHeaderText = xhr.getAllResponseHeaders()
                let headers = new Headers()
                let has_header = false
                rawHeaderText.split(/\r\n/).forEach(line => {
                    let m = line.match(/^([^:]+): (.*)$/)
                    if (!m || m.length < 3) return
                    headers.set(m[1], m[2])
                    has_header = true
                })
                resolve(new Response(xhr.responseText, {
                    status: xhr.status,
                    statusText: xhr.statusText,
                    headers: has_header ? headers : undefined
                }))
            }
            xhr.send(input.body as any)
        })
    }
}