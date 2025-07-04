# Development stage
FROM node:18-alpine AS dev
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
EXPOSE 3003
CMD ["npm", "run", "dev", "--", "--host"]