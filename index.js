#!/usr/bin/env node
const cli = require('./cli');
const mqtt = require('./mqtt');
const renogy = require('./renogy');
const logger = require('./logger');

async function main() {

    logger.trace('Starting NodeRenogy...');

    try {
        const args = cli.args;

        logger.trace(args, 'With arguments...')

        await renogy.begin();

        //poll controller and publish at the interval specified
        setInterval(
            async function() {
                const result = await renogy.getData();   

                //if we have MQTT broker, try to publish
                if(args.mqttbroker) {
                    await mqtt.publish(result);
                }
            }, 
            args.pollinginterval * 100
        );
    }
    catch(e) {
        logger.error(e);
        process.exit(1);
    }
}

main();
