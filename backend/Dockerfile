FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy dependency files first
COPY package*.json ./

# Install backend dependencies
RUN npm install

# Copy backend source code
COPY . .

# Backend application port (change if different)
EXPOSE 5000

# Start backend server
CMD ["npm", "start"]
