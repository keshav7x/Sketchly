FROM oven/bun:latest

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install

COPY . .

WORKDIR /app/apps/api


EXPOSE 4000

CMD ["bun", "run","dev"]