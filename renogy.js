const cli = require('./cli');
const ModbusRTU = require("modbus-serial");
const modbusClient = new ModbusRTU();

//as per renogy docs
const startRegister = 0x100;
const numRegisters = 30;
const args = cli.args;

const renogyValues = {
    /*battCap:0,
    battV:0,
    battC:0,
    battTemp:0,
    loadV:0,
    loadC:0,
    loadP:0,
    solarV:0,
    solarC:0,
    solarP:0,
    battVMinToday:0,
    battVMaxToday:0,*/
    setData: function(rawData) {
        //Register 0x100 - Battery Capacity - 0
        this.battCap = rawData[0];
        //Register 0x101 - Battery Voltage - 1
        this.battV = (rawData[1] * 0.1).toFixed(2);
        //Register 0x102 - Battery Charge Current - 2
        this.battC = (rawData[2] * 0.01).toFixed(2);
        //TODO: Register 0x103 - Battery Temperature - 3
        /*this.battTemp = function() {
            const tempBits = rawData[3] >> 8;
            tempVal = tempBits + 0xff;
            sign = tempBits >> 7;
            result = sign == 1 ? -(tempVal-128) : tempVal;
            return result;
        }*/
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

module.exports = {
    begin: async function(){
        modbusClient.setTimeout(500);
        await modbusClient.connectRTUBuffered(args.serialPort, { baudRate: args.baudRate });
    },
    getData: async function() {
        if(!modbusClient.isOpen) {
            this.begin();
        }
        if(modbusClient.isOpen) {
            let data =  await modbusClient.readHoldingRegisters(startRegister, numRegisters);
            if(data.data) {
                renogyValues.setData(data.data);
                return renogyValues;
            }
        }
    }
}
