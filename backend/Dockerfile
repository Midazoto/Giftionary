FROM alpine:latest
ARG PB_VERSION=0.22.0

RUN apk add --no-cache unzip ca-certificates sqlite
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/

# On s'assure que le dossier migrations existe
RUN mkdir -p /pb/pb_migrations

COPY start-pocketbase.sh /pb/start-pocketbase.sh
RUN chmod +x /pb/start-pocketbase.sh

EXPOSE 8090

# Commande : Applique les migrations existantes PUIS lance le serveur
CMD ["/pb/start-pocketbase.sh"]