# NodeRenogy

Utility to retrieve data from Renogy solar controllers and publish it to MQTT, written in NodeJS.

Data can then be surfaced in Home Assistant, or anything else that can read from a MQTT bus.

### Compatability

See below table, in theory this should work with any Renogy solar controller, but the below have been tested.
If you have success with one not listed here, please let me know by raising an issue!

|Controller|Interface|Notes|Status|
|----------|---------|-----|------|
|Renogy Wanderer|RS232|Has no switched load, so load values are always 0|✅|

### Connecting your Controller

Renogy controllers use either RS232 or RS485 for serial communications, for either you will need an interface that supports the protocol your controller uses. 

Generally, standard PC serial ports (DB9/DB25) are RS232, if your machine doesn't have one you can use a USB > Serial adapter. For RS485 you will need a USB > RS485 adapter or similar.

**NOTE:** TTL Serial (as found on Raspberry Pi's, Microcontrollers, etc) is **not** the same as RS232. RS232 operates at higer voltages and can damage equpiment if connected to a TTL serial port. You **must** use an adapter (e.g a MAX3232) with TTL serial ports.

I will be covering RS232 here, as that's what my controller (Renogy Wanderer) supports. I am using a USB > Serial adapter connected to a Raspberry Pi Zero. The adapter I have uses the Prolific PL2303 chipset, I would recomend one using this chipset. They can be had from [Amazon](https://www.amazon.co.uk/gp/product/B003WOWBBW/ref=ppx_yo_dt_b_asin_title_o00_s00?ie=UTF8&psc=1), etc for under £20.

Once you have a way to connect to RS232 devices, you will also need a cable. As far as I can see, Renogy do not sell these. So you will need to make one.

The Renogy Wanderer (and other controllers that use RS232) has a RJ12 jack that it uses for serial communcations. This will need to be connected to your RS232 interface. In my use case, I built a RJ12 > DB9 cable to use with a Serial > USB adapter. 

The RJ12 connector on the controller has 6 pins, with the first 3 being needed for our cable. The remaining pins are for power. See the below table for the pinout.

|RJ12 Pin|DB9 Pin|Function|
|--------|-------|--------|
|1|2|Serial TX > RX|
|2|3|Serial RX > TX|
|3|5|Ground|
|4| |Ground|
|5| |VCC (+15V)|
|6| |VCC (+15V)|

RJ12 and DB9 Pins are counted right to left, with the contacts facing you.

![Wiring Diagram](cable_wiring_diagram.png)

When building your cable, *please* check voltages with a multimeter to ensure you have the connections correct. In my testing you should see ~5v between the TX (RJ12 Pin 1) and GND (RJ12 Pin 3), ~0.1v between RX (RJ12 Pin 2) and GND and ~5v between TX and RX)

### Using the utility

TODO: Document steps for running as service

Ideally you would install/run this on a device that is connected to your solar controller all the time. I use a Raspberry Pi 0 W, which is more than powerful enough for this use case. 

This also assumes you have a MQTT broker setup and running already. If you don't want to use MQTT you can output the results to the console. Support for other output methods may come at a later date.

You will first need to ensure you have NodeJS v16+ installed on your device.

The Pi 0/1 doesn't have offical support for newer version of NodeJS, so follow the instructions [here](https://hassancorrigan.com/blog/install-nodejs-on-a-raspberry-pi-zero/) to get it installed.

If you are using a Pi 2 or later, follow the instructions [here](https://lindevs.com/install-node-js-and-npm-on-raspberry-pi/) to install the offical NodeSource build.

Once you've got NodeJS installed, then follow the below instructions.

1. Clone this repository (or donwload it) by running;

`git clone https://github.com/mickwheelz/NodeRenogy.git`

2. Change to the `NodeRenogy` directory and install the dependancies by running the below commands

`cd NodeRenogy`

`npm install`

3. Run the utility on the device your controller is connected to, see below for examples.

Basic Example:

`node index.js -s /dev/ttyUSB0 -m 192.168.0.10`

This would use serial port `/dev/ttyUSB0` and connect to MQTT Broker at `192.168.0.10` with no user/password, publishing to the `NodeRenogy/state` topic ever 60s.

The utility supports using different polling intervals and topics, as well as MQTT brokers that need authentication, please see below for a full list of options.

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

The values can be displayed in Home Assistant by adding them as [sensors](https://www.home-assistant.io/integrations/sensor.mqtt/) in the `configuration.yaml` files. 

Essentially you just need to extract the values from the JSON payload published to MQTT. For each value you want to use in Home Assistant, add a MQTT sensor entry in your config file.

See below for some examples;

```
sensor:
  - platform: mqtt
    name: "Current Battery Capacity"
    state_topic: "NodeRenogy/state"
    value_template: "{{ value_json['battCap'] }}"
    unit_of_measurement: "%"
    device_class: battery

- platform: mqtt
    name: "Current Battery Voltage"
    state_topic: "NodeRenogy/state"
    value_template: "{{ value_json['battV'] }}"
    unit_of_measurement: "V"
    device_class: battery
```
