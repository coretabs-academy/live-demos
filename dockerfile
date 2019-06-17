FROM python:alpine3.7

RUN apk update && apk upgrade
RUN apk add nginx \
    && mkdir -p /run/nginx

RUN apk add supervisor

COPY nginx.conf /etc/nginx/conf.d/demos.conf
COPY empty.conf /etc/nginx/conf.d/default.conf

ADD ./supervisord.conf /etc/supervisord.conf

COPY . /var/demos
WORKDIR /var/demos

RUN pip install --upgrade pip \
    && pip install --upgrade setuptools \
    && pip install -r requirements.txt