FROM mcr.microsoft.com/playwright:v1.62.0-noble

RUN mkdir /practiceapp
WORKDIR /practiceapp
COPY . /practiceapp/

RUN npm install --force
RUN npx playwright install
