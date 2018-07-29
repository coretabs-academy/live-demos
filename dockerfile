FROM python:alpine3.7

COPY . /var/demos
WORKDIR /var/demos

RUN apk update && apk upgrade

RUN pip install --upgrade pip \
    && pip install --upgrade setuptools \
    && pip install -r requirements.txt

RUN apk add nginx \
    && mkdir -p /run/nginx
COPY nginx.default /etc/nginx/sites-enabled/default
RUN nginx && nginx -g "daemon off;"; exit 0 \
    && nginx && nginx -s reload