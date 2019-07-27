FROM python:alpine3.7

RUN apk update && apk upgrade

RUN apk add --virtual deps gcc python-dev linux-headers musl-dev postgresql-dev
RUN apk add --no-cache libpq
RUN apk add jpeg-dev \
    zlib-dev \
    freetype-dev \
    lcms2-dev \
    openjpeg-dev \
    tiff-dev \
    tk-dev \
    tcl-dev \
    harfbuzz-dev \
    fribidi-dev \
    libcurl

RUN apk add nginx \
    && mkdir -p /run/nginx \
    && apk add supervisor

RUN pip install --upgrade pip \
    && pip install --upgrade setuptools \
    && pip install virtualenv

RUN virtualenv /var/envs/django \
    && virtualenv /var/envs/flask

COPY ./demos/django_requirements.txt /var/demos/django_requirements.txt
COPY ./demos/flask_requirements.txt /var/demos/flask_requirements.txt
RUN source /var/envs/django/bin/activate && pip install -r /var/demos/django_requirements.txt
RUN source /var/envs/flask/bin/activate && pip install -r /var/demos/flask_requirements.txt

RUN mkdir /var/log/gunicorn

COPY ./nginx.conf /etc/nginx/conf.d/demos.conf
COPY ./empty.conf /etc/nginx/conf.d/default.conf

ADD ./supervisord.conf /etc/supervisord.conf

COPY ./demos /var/demos
WORKDIR /var/demos