# Base Image node bullseye (Debian-based)
FROM node:18-bullseye

# Install dependencies
RUN apt-get update && apt-get install -y \
    tzdata \
    ffmpeg \
    git \
    imagemagick \
    python3 \
    graphicsmagick \
    sudo \
    curl \
    bash \
    libvips-dev

# Clean up
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Clone the repository
RUN git clone https://github.com/AstroAnalytics/XopBot /root/bot

# Set working directory
WORKDIR /root/bot

# Clean npm cache and remove existing node_modules
RUN npm cache clean --force && rm -rf node_modules

# Install dependencies
RUN npm install --unsafe-perm

# Expose port
EXPOSE 9000

# Start the application
CMD ["npm", "start"]