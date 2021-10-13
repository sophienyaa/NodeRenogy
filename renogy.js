const cli = require('./cli');
const logger = require('./logger');
const ModbusRTU = require("modbus-serial");
const modbusClient = new ModbusRTU();

const dataStartRegister = 0x100;
const numDataRegisters = 30;
const infoStartRegister = 0x00A;
const numInfomRegisters = 15;

const args = cli.args;

const renogyValues = {
    setData: function(rawData) {
        //Register 0x100 - Battery Capacity - 0
        this.battCap = rawData[0];
        //Register 0x101 - Battery Voltage - 1
        this.battV = (rawData[1] * 0.1).toFixed(2);
        //Register 0x102 - Battery Charge Current - 2
        this.battC = (rawData[2] * 0.01).toFixed(2);
        
        //Register 0x103 - Battery/Controller Temperature - 3
        //0x103 returns two bytes, one for battery and one for controller temp in c
        const buf = Buffer.alloc(2)
        buf.writeInt16BE(rawData[3]);
        this.battT = buf[0];
        this.controlT = buf[1];

        //Register 0x104 - Load Voltage - 4
        this.loadV = (rawData[4] * 0.1).toFixed(2);
        //Register 0x105 - Load Current - 5
        this.loadC = (rawData[5] * 0.01).toFixed(2);
        //Register 0x106 - Load Power - 6
        this.loadP = rawData[6];
        //Register 0x107 - Solar Panel (PV) Voltage - 7
        this.solarV = (rawData[7] * 0.1).toFixed(2);
        //Register 0x108 - Solar Panel (PV) Current - 8
        this.solarC = (rawData[8] * 0.01).toFixed(2);
        //Register 0x109 - Solar Panel (PV) Power - 9
        this.solarP = rawData[9];
        //Register 0x10A - Turn on load, write register, unsupported in wanderer - 10
        //Register 0x10B - Min Battery Voltage Today - 11
        this.battVMinToday = (rawData[11] * 0.1).toFixed(2);
        //Register 0x10C - Min Battery Voltage Today - 12
        this.battVMaxToday = (rawData[12] * 0.1).toFixed(2);
        //Register 0x10D - Max Charge Current Today - 13
        this.chgCMaxToday = (rawData[13] * 0.01).toFixed(2);
        //Register 0x10E - Max Discharge Current Today - 14
        this.dischgCMaxToday = (rawData[14] * 0.1).toFixed(2);
        //Register 0x10F - Max Charge Power Today - 15 
        this.chgPMaxToday = (rawData[15]).toFixed(2);
        //Register 0x110- Max Discharge Power Today - 16
        this.dischgPMaxToday = (rawData[16]).toFixed(2);
        //Register 0x111- Charge Amp/Hrs Today - 17
        this.chgAHToday = (rawData[17]).toFixed(2);
        //Register 0x112- Discharge Amp/Hrs Today - 18
        this.dischgAHToday = (rawData[18]).toFixed(2);
        //Register 0x113- Charge Watt/Hrs Today - 19
        this.chgWHToday = (rawData[19]).toFixed(2);
        //Register 0x114- Discharge Watt/Hrs Today - 20
        this.dischgWHToday = (rawData[20]).toFixed(2);
        //Register 0x115- Controller Uptime (Days) - 21
        this.uptime = rawData[21];
        //TODO: More registers
    }
};
const controllerInfo = {
    setData: function(rawData) { 
        //Register 0x0A - Controller voltage and Current Rating - 0
        const x0a = Buffer.alloc(2)
        x0a.writeInt16BE(rawData[0]);
        this.controllerV = x0a[0];
        this.controllerC = x0a[1];
        //Register 0x0B - Controller discharge current and type - 0
        const x0b = Buffer.alloc(2)
        x0b.writeInt16BE(rawData[1]);
        this.controllerDischgC = x0b[0];
        this.controllerType = x0b[1] == 0 ? 'Controller' : 'Inverter';
        //Registers 0x0C to 0x13 - Product Model
        const x0c = Buffer.alloc(16);
        let modelString = '';
        let res = [];
        for (let i = 0; i <= 5; i++) {  
            //combinedModel+= ;
            rawData[i+2].toString(16).match(/.{1,2}/g).forEach( x => {
                modelString += parseInt(x, 16).toString('utf8');
            });
            combinedHex += rawData[i+2].toString(16).match(/.{1,2}/g).join();

        }
        console.log(modelString);


        //console.log(combinedModel);

       // console.log(combinedModel.toString('utf8'));
    }
};

async function readController(startRegister, numRegisters) {
    try {
        if(!modbusClient.isOpen) {
            this.begin();
        }
        if(modbusClient.isOpen) {
            let data =  await modbusClient.readHoldingRegisters(startRegister, numRegisters);
            if(data.data) {
                logger.trace(data.data, 'Raw data from controller:');
                return data.data;
            }
        }
    }
    catch(e) {
        logger.error(e);
        process.exit(1);
    }
}

module.exports = {
    begin: async function(){
        logger.trace('Connecting to controller...');
        try {
            modbusClient.setTimeout(500);
            await modbusClient.connectRTUBuffered(args.serialport, { baudRate: args.baudrate });
            logger.info('Connected to controller!');
        }
        catch(e) {
            logger.error(e);
            process.exit(1);
        }
    },
    getData: async function() {
        logger.trace('Getting data from controller...');
        const rawData = await readController(dataStartRegister, numDataRegisters);
        renogyValues.setData(rawData);
        return renogyValues;

    },
    getControllerInfo: async function() {
        logger.trace('Getting information about controller...');
        const rawData = await readController(infoStartRegister, numInfomRegisters);
        controllerInfo.setData(rawData);
        return controllerInfo;
    }
}
