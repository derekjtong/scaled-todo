# for syntax details, see https://docs.docker.com/engine/reference/builder/
# trick to get environment variables https://vsupalov.com/docker-build-pass-environment-variables/

# Python
FROM python:3

# Build arguments
ARG api_ip

# Environment variables
ENV TODO_API_IP=${api_ip:-failed}

# Install dependencies
RUN pip install flask requests gunicorn

# Expose 5000 
EXPOSE 5000/tcp

# Copy the current directory contents into the container at /app
COPY . /app

# Set the working directory to /app
WORKDIR /app

# Run application using Gunicorn
# CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "server:app"]
CMD python server.py