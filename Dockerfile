# syntax=docker/dockerfile:1
FROM nodejs:latest

# Run installer
RUN npm install

# Link command
RUN npm link

# Add latest mosquitto repo
RUN apt-add-repository ppa:mosquitto-dev/mosquitto-ppa

# Install mosqutto and cron
RUN apt-get install -y mosquitto mosquitto-clients

# Install timezone dependencies and establish docker container timezone
RUN DEBIAN_FRONTEND=noninteractive apt-get -y install tzdata
ENV TZ=America/Phoenix
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Copy necessary files to local docker container environment
COPY mosquitto.conf /etc/mosquitto/
ADD cli.js /cli.js
ADD WriteToFile.js /WriteToFile.js
ADD index.js /index.js
ADD logger.js /logger.js
ADD mqtt.js /mqtt.js
ADD renogy.js /renogy.js

# Create necessary files and directories inside docker container
RUN mkdir -p /Data
RUN mkdir -p /Data/logs

# Start services in container (sleep command to give mosquitto time to start before using)
CMD service mosquitto start \
    && sleep 5 \
    && bash
    && node-renogy -s /dev/ttyUSB0 -m IPADDRESS
