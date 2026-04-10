FROM node:16

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# ✅ ADD THIS
ARG REACT_APP_RAPID_API_KEY
ENV REACT_APP_RAPID_API_KEY=$REACT_APP_RAPID_API_KEY

RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
