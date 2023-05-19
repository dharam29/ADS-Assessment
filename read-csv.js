import fs from 'fs';

const readCSVData = () => {
    return new Promise((resolve, reject) => {
        fs.readFile('csvdata.csv', 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                try {
                    // Parse CSV data into an array of objects
                    const lines = data.split('\n');
                    const headers = lines[0].split(',');
                    const csvData = lines.slice(1).map(line => {
                        const values = line.split(',');
                        const obj = {};
                        headers.forEach((header, index) => {
                            if(values[index]){
                                obj[header] = values[index];
                            }
                        });
                        return obj;
                    });

                    // Filter out empty objects
                    const filteredData = csvData.filter(obj => Object.keys(obj).length > 0);
                    resolve(filteredData);
                } catch (err) {
                    reject(err);
                }
            }
        });
    });
};

export default readCSVData;