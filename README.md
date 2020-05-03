# Live Demos

## Deploy Commands

```
ssh -i ssh_key.pem USER_NAME@YOUR_IP_ADDRESS

sudo -i

cd /var/live-demos

git pull

docker-compose up -d --force-recreate --build
```

## Develop Locally

### 1. Add to your hosts file the following

```
127.0.0.1	demos.coretabs.net
127.0.0.1	frontend-backend-difference.demos.coretabs.net
127.0.0.1	facebook-like-app.demos.coretabs.net
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