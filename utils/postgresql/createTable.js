const fs = require('fs'),
    through = require('through'),
    split = require('split')

//PostgreSQL Connection Module
const { Pool, Client } = require('pg')

//PG-Streams
const copyFrom = require('pg-copy-streams').from

//Create Pool Object to Connect to External Database
const pool = new Pool({
    user: "dbmsowner",
    host: "vidocker.unx.sas.com",
    database: "external",
    password: "Go4thsas",
    port: 6032,
    ssl: true
})

var inFile = fs.createReadStream('../../geodata/input/EMS_lite.csv'),
    //Change to Copy Stream Command to Fill in table
    //outFile = fs.createWriteStream('COPY wheat FROM 'EMS_LITE.csv' DELIMITER ';' CSV HEADER'),
    outFile = pool.query(copyFrom("COPY ems_lite FROM 'EMS_lite.csv' DELIMITER ';' CSV HEADER")),
    headers

var th = through(function (data) {
    console.log(typeof(data))
    console.log("had headers: " + headers)
  if (typeof headers === "undefined") {
    headers = data
    th.pause()
    setTimeout(function () { 
        //Create Table Command
        pool.query('CREATE TABLE chad.new_table()', (err, res) => {
            //console.log(err, res)
            //End Connection and Free Pool
            pool.end()
          })
        th.resume(); }, 5000)
    } else {
    this.queue(data + "\n")
  }
  console.log(data)
});

inFile.pipe(split())
  .pipe(th)
  //.pipe(outFile)
//.on("close", function () {
//console.log("had headers: " + headers)
  //});