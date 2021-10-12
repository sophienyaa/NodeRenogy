const yargs = require('yargs');

const argv = yargs
    .option('serialport', {
        alias: 's',
        description: 'REQUIRED: Serial port your controller is connected to (e.g -s /dev/ttyUSB0)',
        type: 'string',
    })
    .option('baudrate', {
        alias: 'b',
        description: 'The baud rate to use for serial communications, defaults to 9600 (e.g -b 14400)',
        type: 'integer',
        default: 9600
    })
    .option('mqttbroker', {
        alias: 'm',
        description: 'The address of your MQTT Broker (e.g -m 192.168.0.10)',
        type: 'string',
    })
    .option('mqttuser', {
        alias: 'u',
        description: 'The username for your MQTT Broker (e.g -u mqttUser)',
        type: 'string',
    })
    .option('mqttpass', {
        alias: 'p',
        description: 'The password for your MQTT Broker (e.g -p mqttPass)',
        type: 'string',
    })
    .option('mqtttopic', {
        alias: 't',
        description: 'MQTT topic to publish to defaults to \'NodeRenogy\' (e.g -t MyTopic)',
        type: 'string',
        default: 'NodeRenogy'
    })
    .option('pollinginterval', {
        alias: 'i',
        description: 'How frequently to poll the controller in seconds, defaults to 60 (e.g -i 90)',
        type: 'integer',
        default: 60
    })
    .option('loglevel', {
        alias: 'l',
        description: 'Logging level to use, values are trace, debug, info, warn, error, fatal. Defaults to error',
        type: 'string',
        default: 'error'
    })
    .help()
    .alias('help', 'h')
    .env('NODERENOGY')
    .demandOption('serialport', 'You must specify a serial port')
    .argv;

module.exports = {
    args: argv
};
