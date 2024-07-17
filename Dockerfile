# Node 16 LTS (buster-slim) as the base image
FROM node:16-buster-slim
RUN apt-get update && apt-get install -y \
    ffmpeg \
    git \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
RUN git clone https://github.com/AstroAnalytics/XopBot /root/bot
WORKDIR /root/bot
# Clean npm cache and remove existing node_modules
RUN npm cache clean --force && rm -rf node_modules
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]
