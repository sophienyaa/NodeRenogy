#!/usr/bin/env node
const cli = require('./cli');
const mqtt = require('./mqtt');
const renogy = require('./renogy');
const logger = require('./logger');

async function main() {

    logger.info('Starting NodeRenogy...');

    try {
        const args = cli.args;
        logger.trace(args, 'With arguments...')
        await renogy.begin();

        const controllerInfo = await renogy.getControllerInfo();
        logger.trace(controllerInfo, 'Controller Info...');

        setInterval(
            async function() {
                const result = await renogy.getData();   

                if(args.mqttbroker) {
                    await mqtt.publish(result);
                }
                else {
                    logger.trace('No MQTT broker specified!');
                    console.log(result);
                }
            }, 
            args.pollinginterval * 1000
        );
    }
    catch(e) {
        logger.error(e);
        process.exit(1);
    }
}

main();
