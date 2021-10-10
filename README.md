# NodeRenogy

Utility to retrieve data from Renogy solar controllers and publish it to MQTT, written in NodeJS

### Connecting your Controller

Renogy controllers use either RS232 or RS485 for serial communications. I will be covering RS232 here, as that's what my controller (Renogy Wanderer) supports.

Many computers (still!) have RS232 serial ports, but if yours does not, or you intend to use a Raspberry Pi or similar then you will need a USB -> RS232 adapter. 

I have one from StarTec that uses the Prolific PL2303 chipset, I would recomend one using this chipset. They can be had from Amazon, etc for under £20.

Once you have a way to connect to RS232 devices, you will also need a cable. The Renogy Wanderer has a RJ12 jack that it uses for serial communcations, so you will need to make a cable to convert this to DB9 for use with your serial port/adapter.

The RJ12 connector on the controller has 6 pins, with the first 3 being needed for our cable

1. RS232 TX > DB9 Pin 2 (RX)
2. RS232 RX > DB9 Pin 3 (TX)
3. GND > DB9 Pin 5 (GND)
4. GND
5. VCC
6. VCC

TODO: Images

### Using the utility

Ideally you would install/run this on a device that is connected to your solar controller all the time. I use a Raspberry Pi Zero W, which is more than powerful enough for this use case. This also assumes you have a MQTT broker setup and running already. 

If you don't want to use MQTT you can output the results to the console. Support for other output methods may come at a later date.

This code was written using NodeJS v16, so you will first need to install that. Other versions may work, but have not been tested.

The Pi Zero doesn't have offical support for newer version of NodeJS, so follow the instructions [here](https://hassancorrigan.com/blog/install-nodejs-on-a-raspberry-pi-zero/) to get it installed. (will also work with a Pi 1)

If you are using a Pi 2 or later, follow the instructions [here](https://lindevs.com/install-node-js-and-npm-on-raspberry-pi/) to install the offical NodeSource build.

Once you've got NodeJS installed, then follow the below instructions.

1. Clone this repository (or donwload it) by running

`git clone https://github.com/mickwheelz/NodeRenogy.git`

2. Install the dependancies by running

`npm install`

3. Run the utility on the device your controller is connected to, see below for examples.

Basic Example:

`node index.js -s /dev/ttyUSB0 -m 192.168.0.10`

This would use serial port `/dev/ttyUSB0` and connect to MQTT Broker at `192.168.0.10` with no user/password.

The utiluty has the following options:

|Argument |Alias |Description | Example |
|---------|------|----------|-----|
|--serialPort|-s|REQUIRED: Serial port your controller is connected to|-s /dev/ttyUSB0|
|--baudRate|-b|The baud rate to use for serial communications, defaults to 9600|-b 14400|
|--mqttBroker|-m|The address of your MQTT Broker|-m 192.168.0.10|
|--mqttUser|-u|The username for your MQTT Broker|-u mqttUser|
|--mqttPass|-p|The password for your MQTT Broker|-p mqttPass| 
|--mqttTopic|-t| MQTT topic to publish to defaults to 'NodeRenogy'|-t MyTopic|
|--pollingInterval|-i|How frequently to poll the controller in seconds, defaults to 60|-i 90|
|--debug|-d|Enable or disable debugging mode, it is disabled by default|-d true|   
|--help|-h|Show help ||
|--version||Show version number|  |              

### Getting data into Home Assistant

TODO
