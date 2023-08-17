#!/usr/bin/env node
const cli = require('./cli');
const mqtt = require('./mqtt');
const renogy = require('./renogy');
const logger = require('./logger');
const writeToFile = require('./writeToFile');

async function main() {

    logger.info('Starting NodeRenogy...');

    try {
        const args = cli.args;
        logger.trace(args, 'With arguments...')
        await renogy.begin();

        const controllerInfo = await renogy.getControllerInfo();
        logger.trace(controllerInfo, 'Controller Info...');
        await writeToFile.writeToJSON(controllerInfo, 'device');

        if(args.mqttbroker) {
            await mqtt.publish(controllerInfo, 'device');
        }

        setInterval(
            async function() {
                const result = await renogy.getData();   

                await writeToFile.writeToJSON(result, 'state');

                if(args.mqttbroker) {
                    await mqtt.publish(result, 'state');
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
