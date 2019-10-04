const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const request = require('request');
const APIKEY = "abf029fa2c8f9977de968e3129a8ee0f";
const { Parser } = require('json2csv');

exports.getIndex = (req, res, next) => {
      res.render('home/index', {
        pageTitle: 'Home',
      });
};

exports.upload = (req, res, next) => {
    readFileAndConvertToEuroValues(res);
    

};

readFileAndConvertToEuroValues = (res)=>{
    const url = `http://data.fixer.io/api/latest?access_key=${APIKEY}`;
    const options = {
        url: url,
        headers: {
          'User-Agent': 'request'
        }
      };
      const tmpEuroValues = [];
      const fields = ['Currency', 'Eurovalue'];
      const json2csvParser = new Parser({ fields });


      request(options, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            const info = JSON.parse(body);
            
            fs.createReadStream(path.join(__dirname,'..','csvs', 'testcsv.csv'))
                .pipe(csv())
                .on('data', (row) => {

                    console.log(row.Currency);
                    for(let key in info.rates){
                        if(key == row.Currency){
                            let tmpObj = {};
                            tmpObj["Currency"] = key;
                            tmpObj["Eurovalue"] = info.rates[key];
                            tmpEuroValues.push(tmpObj);
                            tmpObj = {};
                        }
                        // console.log(info.rates[key]);
                    }
                })
                .on('end', () => {
                    // console.log(tmpEuroValues);
                    // console.log('CSV file successfully processed');

                    const csv = json2csvParser.parse(tmpEuroValues);
                    res.setHeader('Content-disposition', 'attachment; filename=euro.csv');
                    res.setHeader('Content-Type', 'application/octet-stream');
                    res.send(csv);
                });
          }
      });
}
