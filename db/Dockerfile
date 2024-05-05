FROM mysql:8.0.36

COPY init.sql /docker-entrypoint-initdb.d

ENV MYSQL_ROOT_PASSWORD=root1234
ENV MYSQL_DATABASE=interviewpartner
ENV MYSQL_HOST=%

CMD ["--character-set-server=utf8mb4", "--collation-server=utf8mb4_unicode_ci"]

HEALTHCHECK --interval=10s --timeout=30s --retries=5 \
  CMD mysqladmin ping -h localhost -u root -p$MYSQL_ROOT_PASSWORD || exit 1
