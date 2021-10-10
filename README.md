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

You simply run it on the device your controller is connected to. I use a Raspberry Pi Zero W, which is more than powerful enough to handle this use case.

Basic Example:

`node index.js -s /dev/ttyUSB0 -m 192.168.0.10`

This would use serial port `/dev/ttyUSB0` and connect to MQTT Broker at `192.168.0.10` with no user/password.

The utiluty has the following options:

|Argument |Alias |Description | Example |
|---------|------|----------|-----|
|--version||Show version number|  |              
|--serialPort|-s|REQUIRED: Serial port your controller is connected to|-s /dev/ttyUSB0|
|--baudRate|-b|The baud rate to use for serial communications, defaults to 9600|-b 14400|
|--mqttBroker|-m|The address of your MQTT Broker|-m 192.168.0.10|
|--mqttUser|-u|The username for your MQTT Broker|-u mqttUser|
| --mqttPass|-p|The password for your MQTT Broker|-p mqttPass| 
|--mqttTopic|-t| MQTT topic to publish to defaults to 'NodeRenogy'|-t MyTopic|
|--pollingInterval|-i|How frequently to poll the controller in seconds, defaults to 60|-i 90|
|--debug|-d|Enable or disable debugging mode, it is disabled by default|-d true|   
|--help|-h|Show help ||

### Getting data into Home Assistant

TODO
