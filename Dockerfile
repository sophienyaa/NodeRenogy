# syntax=docker/dockerfile:1
FROM ubuntu:latest

# Update package list
RUN apt-get update

# Install apt dependencies
RUN apt-get install -y 

# Install pip dependencies
RUN pip install 

# Add latest mosquitto repo
RUN apt-add-repository ppa:mosquitto-dev/mosquitto-ppa

# Install mosqutto and cron
RUN apt-get install -y mosquitto mosquitto-clients cron

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
#ADD crontab /etc/cron.d/simple-cron

# Create necessary files and directories inside docker container
#RUN touch /var/log/cron.log
RUN mkdir -p /Data
RUN mkdir -p /Data/logs

# Establish correct permissions for files
#RUN chmod 0644 /etc/cron.d/simple-cron
RUN chmod +x /PowerMonitor.py
RUN chmod +x /PowerMonitor.sh

# Start services in container (sleep command to give mosquitto time to start before using)
CMD service mosquitto start \
    && sleep 5 \
    #&& cron \
    && bash
