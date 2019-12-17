const fs = require("fs")
const fastcsv = require("fast-csv")

//PostgreSQL Connection Module
const { Pool, Client } = require('pg')

inputFile = '../../geodata/output/test.csv'
table = 'idad.master_geodata'

//PG-Streams
let stream = fs.createReadStream(inputFile);
let csvData = [];
let csvStream = fastcsv
  .parse()
  .on("data", function(data) {
    csvData.push(data);
  })
  .on("end", function() {
    // remove and store the first line: header
    let header = csvData[0]
    console.log(header)
    csvData.shift()
    console.log(csvData)

    // create a new connection to the database
    const pool = new Pool({
        user: "dbmsowner",
        host: "vidocker.unx.sas.com",
        database: "external",
        password: "Go4thsas",
        port: 6032,
        ssl: true
    })

    pool.connect((err, client, done) => {
      if (err) throw err;

      //Find row index values based on Headers 
      


      try {
        csvData.forEach(row => {
          //stringfy row
          rowString = row.map(r => `'${r}'`).join(',');
          console.log(rowString)
          //clear table for testing 
          client.query(`DELETE FROM ${table}`)
          client.query(`INSERT INTO ${table} (location_id, state) VALUES(${rowString})`, row, (err, res) => {
            if (err) {
              console.log(row)
              console.log("oops")
              console.log(err.stack);
            } else {
              console.log("inserted " + res.rowCount + " row:", row);
            }
          });
        });
      } finally {
        done();
      }
    });
  });

stream.pipe(csvStream);