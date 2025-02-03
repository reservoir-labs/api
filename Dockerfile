# May want to start with the bun image instead
FROM node:22-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app

# Install Bun
RUN apk add --no-cache curl \
    && curl -fsSL https://bun.sh/install | bash \
    && rm -rf /var/cache/apk/*

# Add Bun to PATH
ENV PATH="/root/.bun/bin:$PATH"

COPY package.json .
RUN bun install --production
COPY --from=build /app/dist ./dist
COPY --from=build /app/abi ./abi
ENV PORT=80
CMD bun run start:prod

EXPOSE 80
