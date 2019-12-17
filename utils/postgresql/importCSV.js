const fs = require('fs')

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

//Load Table 

// Connecting to Database
pool.connect()
// Execute Copy Function

// const stream = pool.query(copyFrom(`COPY ${table} FROM CSV HEADER STDIN`), (err, res) => {
//     if (err) {
//         console.log(`Error in reading file: ${err}`)
//     } else {
//         console.log(`Completed loading data into ${table}`)
//         pool.end()
//     }
// })
// const fileStream = fs.createReadStream((inputFile), (err) => {
//     if (err) {
//         console.log(`Error in reading file: ${err}`)
//     }
// })

// fileStream.pipe(stream)

const executeQuery = (table) => {
    const execute = (target, callback) => {
        pool.query(`Truncate ${target}`, (err) => {
                if (err) {
                pool.end()
                callback(err)
                // return console.log(err.stack)
                } else {
                console.log(`Truncated ${target}`)
                callback(null, target)
                }
            })
    }
    execute(table, (err) =>{
        if (err) return console.log(`Error in Truncate Table: ${err}`)
        const stream = pool.query(copyFrom(`COPY ${table} FROM STDIN CSV`), (err, res) => {
            if (err) {
                console.log(`Error in reading file: ${err}`)
            } else {
                console.log(`Completed loading data into ${table}`)
                pool.end()
            }
        })
        const fileStream = fs.createReadStream((inputFile), (err) => {
            fileStream.pipe(stream);
            if (err) {
                console.log(`Error in reading file: ${err}`)
            }
        })
    })  
}
// Execute the function
executeQuery(table)