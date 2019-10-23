FROM nginx
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./_src/policy.pdf /var/policy.pdf
EXPOSE 80 443