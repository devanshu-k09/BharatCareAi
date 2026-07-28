# Use official Node.js LTS lightweight image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy dependency configuration files first to cache dependencies layer
COPY --chown=node:node backend/package*.json ./backend/

# Install only production dependencies
RUN npm ci --prefix backend --only=production

# Copy application source code with correct ownership
COPY --chown=node:node backend/ ./backend/
COPY --chown=node:node frontend/ ./frontend/

# Ensure the data directory exists and has write permissions for the node user
RUN mkdir -p /app/backend/data && chown -R node:node /app/backend/data

# Expose the application port
EXPOSE 5000

# Set environment defaults
ENV NODE_ENV=production
ENV PORT=5000

# Switch to the non-root node user for security
USER node

# Set working directory to backend to run the startup script
WORKDIR /app/backend

# Start the application
CMD ["npm", "start"]
