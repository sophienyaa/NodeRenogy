const cli = require('./cli');
const mqtt = require('async-mqtt');
const args = cli.args;

const mqttOptions = {
    username: args.mqttUser,
    password: args.mqttPass,
    clientId: `nodeRenogy_${Math.random().toString(16).substr(2,8)}`    
};

module.exports = {
    publish: async function(data) {
        const client = await mqtt.connectAsync(`tcp://${args.mqttBroker}`, mqttOptions)
        try {
            await client.publish(`${args.mqttTopic}/state`, JSON.stringify(data));
            await client.end();
        } catch (e){
            console.log(e.stack);
            process.exit(1);
        }
    }
}
