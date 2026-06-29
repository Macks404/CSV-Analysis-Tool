# Start with a lightweight Node.js environment
FROM node:18-bullseye-slim

# Install Python 3 and pip
RUN apt-get update && apt-get install -y python3 python3-pip

# Set the main working directory inside the cloud server
WORKDIR /app

# 1. Setup Python Environment
# Copy just the requirements first (helps with caching)
COPY python/requirements.txt ./python/
RUN pip3 install -r python/requirements.txt

# 2. Setup Node Environment
COPY server/package*.json ./server/
# Switch into the server folder to install npm packages
WORKDIR /app/server
RUN npm install

# 3. Copy the rest of the source code
WORKDIR /app
COPY server/ ./server/
COPY python/ ./python/

# 4. Start the Express server
WORKDIR /app/server
EXPOSE 3000
# Ensure this matches the start script in your server/package.json
CMD ["npm", "start"]