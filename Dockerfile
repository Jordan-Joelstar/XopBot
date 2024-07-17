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
    bash \
    # Additional dependencies for canvas
    build-base \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev \
    pixman-dev \
    pangomm-dev \
    libjpeg-turbo-dev \
    freetype-dev

# Clean up
RUN rm -rf /var/cache/apk/*

# Clone the repository
RUN git clone https://github.com/AstroAnalytics/XopBot /root/bot

# Set working directory
WORKDIR /root/bot

# Clean npm cache and remove existing node_modules
RUN npm cache clean --force && rm -rf node_modules

# Install dependencies
RUN npm install --build-from-source

# Expose port
EXPOSE 9000

# Start the application
CMD ["npm", "start"]