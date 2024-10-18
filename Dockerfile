FROM node:20.11.0-slim as builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# install pnpm dependencies

RUN useradd -m ctf
RUN mkdir -p /app $PNPM_HOME
COPY . /app
WORKDIR /app

RUN HOME=/home/ctf pnpm install --frozen-lockfile
RUN pnpm build && rm -rf public-src *.cjs

FROM oven/bun:1.1.20-slim

# install chromium dependencies
RUN apt-get update && \
    DEPS=$(apt-get install --no-install-recommends -s chromium | grep "Inst" | awk '{print $2}' | grep -v "chromium") && \
    apt-get install -y --no-install-recommends $DEPS && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# copy the app
COPY --from=builder /app /app

# copy the home directory for puppeteer
RUN useradd -m ctf
COPY --from=builder /home/ctf /home/ctf


USER ctf
WORKDIR /app
ENV FLAG="flag{test_flag}"
ENV NODE_ENV=production
# restart the server if it crashes
CMD [ "sh", "-c", "while :; do bun start; sleep 1; done" ]

EXPOSE 3000