FROM node:20-alpine

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

ENV PORT = 8000

ENV MONGO_CLIENT = "mongodb+srv://kjbivek:e-comm@cluster0.dc8t8xc.mongodb.net/"
ENV Pass_KEY = 123

ENV JWT_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0Njg2ODkwMmY0NTE4MmQ3ZTk2ODM3MiIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE2ODQ1Njk2MjQsImV4cCI6MTY4NDgyODgyNH0.RcGUhlfA5460YRqQUtty75h3s4Ms4moZ7C5mCgPbfXk

ENV STRIPE_KEY = sk_test_51N9oqqKp09rCNEEW7h8zLYR0szsOY1v5DqwL64wj4vDQ9Hoqs0roiBJmvqi2GJrRSAifknw02qSvka3hlhK6Pjmo00uk2RMg6v

EXPOSE 8000


CMD ["npm", "start"]
