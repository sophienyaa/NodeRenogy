const cli = require('./cli');
const mqtt = require('./mqtt');
const renogy = require('./renogy');

async function main() {
    
    await cli.checkArgs();
    const args = cli.args;
    await renogy.begin();
 
    setInterval(
        async function() {
            const result = await renogy.getData();   

            //if we have MQTT broker, try to publish
            if(args.mqttBroker) {
                await mqtt.publish(result);
            } 
            //if not, or debug is on, log to console
            if(args.debug || !args.mqttBroker) {
                console.log(JSON.stringify(result));
            }
        }, 
        args.pollingInterval * 100
    );
}

main();