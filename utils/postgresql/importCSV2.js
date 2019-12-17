const copyFrom = require('pg-copy-streams').from;
const Readable = require('stream').Readable;
const { Pool,Client } = require('pg');
const fs = require('fs');
const path = require('path');
const datasourcesConfigFilePath = path.join(__dirname,'..','..','server','datasources.json');
const datasources = JSON.parse(fs.readFileSync(datasourcesConfigFilePath, 'utf8'));

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

inputFile = '../../geodata/input/EMS_lite.csv'
table = 'chad.ems_lite'

export const bulkInsert = (table) => {
  pool.connect().then(client=>{
    let done = () => {
      client.release();
    }
    var stream = client.query(copyFrom('COPY employee (name,age,salary) FROM STDIN'));
    var rs = new Readable;
    let currentIndex = 0;
    rs._read = function () {
      if (currentIndex === employees.length) {
        rs.push(null);
      } else {
        let employee = employees[currentIndex];
        rs.push(employee.name + '\t' + employee.age + '\t' + employee.salary + '\n');
        currentIndex = currentIndex+1;
      }
    };
    let onError = strErr => {
      console.error('Something went wrong:', strErr);
      done();
    };
    rs.on('error', onError);
    stream.on('error', onError);
    stream.on('end',done);
    rs.pipe(stream);
  });