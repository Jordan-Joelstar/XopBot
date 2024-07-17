# Base Image node alpine
FROM node:alpine

# Install dependencies
RUN apk add --no-cache \
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
    bash

# Clean up
RUN rm -rf /var/cache/apk/*

# Clone the repository
RUN git clone https://github.com/AstroAnalytics/XopBot /root/bot

# Set working directory
WORKDIR /root/bot

# Clean npm cache and remove existing node_modules
RUN npm cache clean --force && rm -rf node_modules

# Install dependencies
RUN npm install

# Expose port
EXPOSE 9000

# Start the application
CMD ["npm", "start"]