const fs = require('fs');
const os = require('os');
const logger = require('./logger');

module.exports = {
    writeToJSON: async function (data, subTopic) {
        try {
            // define vars
            let jsonData = [];
            let dataDir = '/Data/';
            let hostName = os.hostname();

            let date_time = new Date();
            // get current date
            // adjust 0 before single digit date
            let date = ("0" + date_time.getDate()).slice(-2);
            // get current month
            let month = ("0" + (date_time.getMonth() + 1)).slice(-2);
            // get current year
            let year = date_time.getFullYear();
            // get current hours
            let hours = date_time.getHours();
            // get current minutes
            let minutes = date_time.getMinutes();
            // get current seconds
            let seconds = ("0" + date_time.getSeconds()).slice(-2);

            // add timestamp to data object in the following format: yyyy-MM-dd HH:mm:ss
            data["timestamp"] = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;

            // Define filename
            let fileName = dataDir + hostName + '-' + subTopic + '-' + year + month + date + '.json';

            // See if directory exists
            if (fs.existsSync(dataDir)) {

                // Check if file exists
                if (!fs.existsSync(fileName)) {
                    // create new file if it doesn't exist
                    fs.closeSync(fs.openSync(fileName, 'w'));
                }

                // read file
                const file = fs.readFileSync(fileName);

                // Check if file is empty
                if (file.length == 0) {
                    // Add data to JSON file
                    jsonData.push(data);
                    fs.writeFileSync(fileName, JSON.stringify(jsonData));
                } else {
                    // Append data to JSON file
                    jsonData = JSON.parse(file);

                    // Add element to JSON object
                    jsonData.push(data);
                    fs.writeFileSync(fileName, JSON.stringify(jsonData));
                }
            } else {
                logger.trace("Data directory not found!");
                logger.trace("Creating " + dataDir);

                // Create the data directory and restart the function.
                fs.mkdirSync(dataDir, {recursive: true});
                this.writeToJSON(data, subTopic);
            }

        } catch (e){
            logger.error(e);
        }
    }
   
    ,
    
    writeToCSV: async function(data, subTopic) {
        try {
            // Exclude the 'setData' key from the data object
            const { setData, ...newData } = data;
            // Create a CSV header with the keys from the object
            const header = Object.keys(newData).join(',');
            // Create a CSV row with the values from the object
            const values = Object.values(newData).map(value => `"${value}"`).join(',');

            // Define vars
            let dataDir = '/home/supervisor/Data/NodeRenogy/';
            let hostName = os.hostname();
            let date_time = new Date();
            // get current date
            // adjust 0 before single digit date
            let date = ("0" + date_time.getDate()).slice(-2);
            // get current month
            let month = ("0" + (date_time.getMonth() + 1)).slice(-2);
            // get current year
            let year = date_time.getFullYear();
            // get current hours
            let hours = date_time.getHours();
            // get current minutes
            let minutes = date_time.getMinutes();
            // get current seconds
            let seconds = ("0" + date_time.getSeconds()).slice(-2);

            // Format data into a CSV string
            let csvRow = [
                year + "-" + month + "-" + date,
                hours + ":" + minutes + ":" + seconds
            ].join(',');

            // Define filename
            let fileName = dataDir + hostName + '-' + subTopic + '-' + year + month + date + '.csv';

            // Check if directory exists
            if (fs.existsSync(dataDir)) {

                // Check if file exists
                if (!fs.existsSync(fileName)) {
                    // Create new file if it doesn't exist
                    fs.closeSync(fs.openSync(fileName, 'w'));
                    // Add CSV header
                    fs.appendFileSync(fileName, header + '\n');
                }
                // Append data to CSV file
                fs.appendFileSync(fileName, values + '\n');

            } else {
                console.error("Data directory not found!");
                console.error("Creating " + dataDir);

                // Create the data directory and restart the function.
                fs.mkdirSync(dataDir, { recursive: true });
                this.writeToCSV(data, subTopic);
            }

        } catch (e) {
            console.error(e);
        }
    }


}
