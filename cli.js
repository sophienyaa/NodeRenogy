//libs
const yargs = require('yargs');

const argv = yargs
    .option('serialPort', {
        alias: 's',
        description: 'REQUIRED: Serial port your controller is connected to (e.g -s /dev/ttyUSB0)',
        type: 'string',
    })
    .option('baudRate', {
        alias: 'b',
        description: 'The baud rate to use for serial communications, defaults to 9600 (e.g -b 14400)',
        type: 'integer',
        default: 9600
    })
    .option('mqttBroker', {
        alias: 'm',
        description: 'The address of your MQTT Broker (e.g -m 192.168.0.10)',
        type: 'string',
    })
    .option('mqttUser', {
        alias: 'u',
        description: 'The username for MQTT Broker (e.g -u mqttUser)',
        type: 'string',
    })
    .option('mqttPass', {
        alias: 'p',
        description: 'The password for MQTT Broker (e.g -p mqttPass)',
        type: 'string',
    })
    .option('mqttTopic', {
        alias: 't',
        description: 'MQTT topic to publish to defaults to \'NodeRenogy\' (e.g -t MyTopic)',
        type: 'string',
        default: 'NodeRenogy'
    })
    .option('pollingInterval', {
        alias: 'i',
        description: 'How frequently to poll the controller in seconds, defaults to 60 (e.g -i 90)',
        type: 'integer',
        default: 60
    })
    .option('debug', {
        alias: 'd',
        description: 'Enable or disable debugging mode, it is disabled by default (e.g -d true)',
        type: 'boolean',
        default: false
    })
    .help()
    .alias('help', 'h')
    .argv;

module.exports = {
    checkArgs: async function() {
        if(!argv.serialPort) {
            console.log('You must specity a serial port');
            process.exit(1);
        }
        if(!argv.mqttBroker) {
            console.log('No MQTT broker specified, will log to console only!');
        }
        if(!argv.pollingInterval) {
            console.log('No polling interval specified, defaulting to 60s');
        }
    },
    args: argv
};
