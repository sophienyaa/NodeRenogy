# Specify a base image
FROM node:latest

#Install some dependencies
WORKDIR /
COPY ./ /
RUN npm install async-mqtt modbus-serial mqtt pino pino-pretty yargs

# Start services in container (sleep command to give mosquitto time to start before using)
#CMD service mosquitto start \
#    && sleep 5 \
#    && node-renogy -s /dev/ttyUSB0 -m hatsup1.iot.nau.edu \
#    && bash
CMD bash
