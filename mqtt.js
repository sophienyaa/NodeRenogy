const cli = require('./cli');
const mqtt = require('async-mqtt');
const logger = require('./logger');
const args = cli.args;

const mqttOptions = {
    username: args.mqttuser,
    password: args.mqttpass,
    clientId: `nodeRenogy_${Math.random().toString(16).substr(2,8)}`    
};

module.exports = {
    publish: async function(data) {
        logger.trace('Connecting to MQTT broker...');
        logger.trace(mqttOptions, 'With MQTT options...');
        const client = await mqtt.connectAsync(`tcp://${args.mqttbroker}`, mqttOptions)
        console.log(client);
        try {
            logger.trace('Publishing data to MQTT...');
            await client.publish(`${args.mqtttopic}/state`, JSON.stringify(data));
            await client.end();
        } catch (e){
            logger.error(e);
        }
    }
}
