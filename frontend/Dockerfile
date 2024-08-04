# for syntax details, see https://docs.docker.com/engine/reference/builder/
# trick to get environment variables https://vsupalov.com/docker-build-pass-environment-variables/
FROM python:3
ARG api_ip
ENV TODO_API_IP=${api_ip:-failed}
RUN pip install flask
RUN pip install requests
RUN echo $TODO_API_IP
EXPOSE 5000/tcp
COPY . .
CMD python server.py