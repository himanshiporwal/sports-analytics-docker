# ---------- Build stage ----------
FROM node:20-bullseye AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --include=optional
RUN npm install @rollup/rollup-linux-x64-gnu

COPY . .
RUN npm run build

# ---------- Runtime stage ----------
FROM node:20-bullseye AS runtime
WORKDIR /app

COPY --from=build /app /app

EXPOSE 3000
CMD ["npm", "run", "preview", "--", "--host"]
