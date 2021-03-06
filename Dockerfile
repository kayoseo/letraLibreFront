#FROM node:10-alpine as build-step

#RUN mkdir -p /app

#WORKDIR /app

#COPY package.json /app

#RUN npm install

#COPY . /app


#RUN npm run build 
#Segunda Etapa
#FROM nginx:1.17.1-alpine
	#Si estas utilizando otra aplicacion cambia PokeApp por el nombre de tu app
#COPY --from=build-step /app/dist /usr/share/nginx/html

FROM nginx:1.17.8-alpine
COPY nginx.conf /etc/nginx/nginx.conf
WORKDIR /usr/share/nginx/html
COPY dist/ .