FROM python:alpine3.7

RUN apk update && apk upgrade

COPY ./demos/requirements.txt /var/demos/requirements.txt
RUN pip install --upgrade pip \
    && pip install --upgrade setuptools \
    && pip install -r /var/demos/requirements.txt

RUN apk add nginx \
    && mkdir -p /run/nginx \
    && apk add supervisor

COPY ./nginx.conf /etc/nginx/conf.d/demos.conf
COPY ./empty.conf /etc/nginx/conf.d/default.conf

ADD ./supervisord.conf /etc/supervisord.conf

COPY ./demos /var/demos
WORKDIR /var/demos