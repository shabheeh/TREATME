FROM node:20-slim

# Install Puppeteer dependencies for Ubuntu/Debian
RUN apt-get update && apt-get install -y \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    wget \
    xdg-utils \
    --no-install-recommends && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Create a non-root user for security
RUN groupadd -r nodejs && useradd -r -g nodejs -G audio,video appuser \
    && mkdir -p /home/appuser/Downloads \
    && chown -R appuser:nodejs /home/appuser

# Install dependencies
COPY package*.json ./
RUN npm install

RUN npx puppeteer browsers install chrome

# Copy the full app
COPY . .

# Build TypeScript
RUN npm run build

# Change ownership of the app directory to the non-root user
RUN chown -R appuser:nodejs /app

# Switch to non-root user
USER appuser

# Expose the app port
EXPOSE 5000

# Start the app 
CMD ["node", "dist/server.js"]
