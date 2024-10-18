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

## License

Copyright (c) Cnily03. All rights reserved.

Licensed under the [MIT](LICENSE) License.
