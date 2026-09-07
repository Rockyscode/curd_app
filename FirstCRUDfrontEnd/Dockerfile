# ---------- Build stage ----------
FROM debian:bookworm-slim AS build

ARG NODE_VERSION=22.14.0

# Install dependencies required to download and extract Node.js
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
        xz-utils \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js and npm manually
RUN curl -fsSLO https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.xz \
    && tar -xJf node-v${NODE_VERSION}-linux-x64.tar.xz -C /usr/local --strip-components=1 \
    && rm node-v${NODE_VERSION}-linux-x64.tar.xz

WORKDIR /app

# Copy package files first to improve Docker layer caching
COPY package.json package-lock.json ./

# Install dependencies exactly as specified in package-lock.json
RUN npm ci

# Copy the rest of the application
COPY . .

# Create the production build
RUN npm run build


# ---------- Production stage ----------
FROM nginx:alpine

# Replace the default Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the React production build
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
