const cli = require('./cli');
const mqtt = require('async-mqtt');
const logger = require('./logger');
const args = cli.args;
const client;

const mqttOptions = {
    username: args.mqttuser,
    password: args.mqttpass,
    clientId: `nodeRenogy_${Math.random().toString(16).substr(2,8)}`    
};

module.exports = {
    begin: async function() {
        logger.trace('Connecting to MQTT broker...');
        logger.trace(mqttOptions, 'With MQTT options...');
        client = await mqtt.connectAsync(`tcp://${args.mqttbroker}`, mqttOptions)
        logger.info('Connected to MQTT Broker!')
    },
    publish: async function(data) {
        try {
            logger.trace('Publishing data to MQTT...');
            await client.publish(`${args.mqtttopic}/state`, JSON.stringify(data));
            await client.end();
        } catch (e){
            logger.error(e);
        }
    }
}
