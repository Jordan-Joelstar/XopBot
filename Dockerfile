# Base Image node alpine
FROM node:alpine
RUN apt-get update && apt-get install -y \
    apk add --no-cache \
    tzdata \
    ffmpeg \
    git \
    imagemagick \
    python3 \
    graphicsmagick \
    sudo \
    npm \
    yarn \
    curl \
    bash && \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
RUN apk del curl && \
    rm -rf /var/cache/apk/*
RUN git clone https://github.com/AstroAnalytics/XopBot /root/bot
WORKDIR /root/bot
RUN npm cache clean --force && rm -rf node_modules
RUN npm install
EXPOSE 9000
CMD ["npm", "start"]
