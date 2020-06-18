# Live Demos


## Initial Server Configurations

<details>
<summary>Start here if you prepare your server for the first time.</summary>
<br>


### 1. Server Nginx Configuration (the Nginx outside your container)

/etc/nginx/sites-enabled/default

```
server {
    listen 80;

    server_name *.demos.coretabs.net;

    return 301 https://$host$request_uri;
}


server {
    listen 443 ssl;
    listen [::]:443;

    server_name *.demos.coretabs.net;
	
	ssl_certificate /etc/letsencrypt/live/demos.coretabs.net/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/demos.coretabs.net/privkey.pem;

    location / {
        proxy_pass https://0.0.0.0:8002/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}


server {
    listen 80;
    listen [::]:80;

    server_name demos.coretabs.net;             

    location / {
        root /var/live-demos/demos/statics;
        try_files $uri $uri/ /index.html;
    }
}
```

Note these things:

* Redirection from http to https.

* Usage of custom SSL certificate (as Cloudflare does not support other than top level domains, like *.demos.coretabs.net):
```
ssl_certificate /etc/letsencrypt/live/demos.coretabs.net/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/demos.coretabs.net/privkey.pem;
```

* Static files are being served directly from host (**NOT container**).


### 2. Installing certbot-auto

#### 1. certbot-auto Installation:

You should install certbot-auto on your Ubuntu server **NOT inside your conatiner.**

https://certbot.eff.org/docs/install.html#certbot-auto

#### 2. Check certbot-dns-cloudflare Plugin

The command `certbot-auto plugins` will show the available plugins, if you can't find it install it using:

```
/opt/eff.org/certbot/venv/bin/pip install certbot-dns-cloudflare
```

Now you need to add your Cloudflare token:

```
mkdir /var/cloudflare
echo  "dns_cloudflare_api_token = TOKEN_HERE" > /var/cloudflare/certbot.ini
```

Please, please, please... check **VERY CAREFULLY** that your token has the following permissions (from Cloudflare API Token Panel):

* Zone.Zone, Zone.DNS
* For **ALL** resources.

#### 3. Get Your SSL Certificate

```
certbot-auto certonly \
 --dns-cloudflare \
 --dns-cloudflare-credentials /var/cloudflare/certbot.ini \
 -d *.demos.coretabs.net
```

This command will generate a public_key and private_key on the following paths:

```
/etc/letsencrypt/live/demos.coretabs.net/fullchain.pem
/etc/letsencrypt/live/demos.coretabs.net/privkey.pem
```

**Both files are synced in docker-compose using volumes.**

#### 4. Certificate Auto Renewal

```
touch /etc/letsencrypt/renewal-hooks/post/01-reload-nginx
chmod 0755 /etc/letsencrypt/renewal-hooks/post/01-reload-nginx
```

This will create an executable file that will reload Nginx upon certificate auto renewal, it should contain the following:

```
#!/bin/bash

echo "nginx reloading..."
nginx -s reload

echo "container nginx reloading..."
docker-compose --compatibility -f /var/live-demos/docker-compose.yml exec apps /bin/sh -c "nginx -s reload"

echo "done... new certificate ready!"
```

#### 5. Try Auto Renewal

```
certbot-auto renew --dry-run
```

If you see the message `done... new certificate ready!`, then everything is running smoothly.


## Env vars

Environment variables are managed in [`supervisord.conf` here](https://github.com/coretabs-academy/live-demos/blob/master/supervisord.conf)


## Deploy Commands

```
ssh -i ssh_key.pem USER_NAME@YOUR_IP_ADDRESS

sudo -i

cd /var/live-demos

git pull

docker-compose --compatibility up -d --force-recreate --build
```

## Adding New Website

1. Add it to nginx.conf **and nginx.dev.conf**
2. Add it to supervisord.conf
3. Check the python requirements (django_requirements.txt / flask_requirements.txt)
4. Add it to your hosts (if you're developing locally)

* For static website just add them in the static directory and that's all 😁
</details>


## Develop Locally

### 1. Add to your hosts file the following

```
127.0.0.1	demos.coretabs.net
127.0.0.1	frontend-backend-difference.demos.coretabs.net
127.0.0.1	facebook-like-app.demos.coretabs.net
127.0.0.1   django-store.demos.coretabs.net
```

### 2. Create certificate using mkcert

```
# install mkcert
wget https://github.com/FiloSottile/mkcert/releases/download/v1.4.1/mkcert-v1.4.1-linux-amd64
mv mkcert-v1.4.1-linux-amd64 mkcert
chmod +x mkcert
sudo mv mkcert /usr/local/bin/

# create certificate
mkcert ./cert testssl.local localhost 127.0.0.1 ::1
```

### 3. Run on docker-compose using

```
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --force-recreate --build
```