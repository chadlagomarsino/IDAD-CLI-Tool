/*
COMMAND LINE TOOL FOR JPS IDAD DEMO KIT
Author: Chad Lagomarsino
*/

//3rd Party Modules
const yargs = require('yargs')

//Local Module References 
const csvgeocode = require('./utils/geocoding/csvgeocode.js')
const reversecsvgeocode = require('./utils/geocoding/reversecsvgeocode.js')
const handlers = require('./utils/geocoding/handlers.js')

//Geocoding Commands

//Forward Geocode a CSV File from ./geodata/input and Write a new CSV File to ./geodata/output
//include the flag --inputcsv = 'this_is_a_CSV_name' after the geo commmand
yargs.command({ 
    //name of command to enter into terminal
    command: 'geo',
    describe: 'forward geocode a CSV file',
    builder: {
        inputcsv: {
            describe: 'name of input CSV',
            demandOption: false, 
            type: 'string'
        }
    },
    handler(argv) {
        const options = {
        /*
        To use Mapbox API, uncomment the following line and comment out the google url 
        "url": "https://api.mapbox.com/geocoding/v5/mapbox.places/{{address}}.json?access_token=pk.eyJ1IjoiY2hhZGxhZ29tYXJzaW5vIiwiYSI6ImNrMzNtM2dndzBuc3UzaXMycXNhbDV3c2UifQ.SiOMsGZ2j0o8NKzbYslP1w",
        */
        "url": "https://maps.googleapis.com/maps/api/geocode/json?address={{address}}&key=AIzaSyDfZYegb4O_tj4qGDGvVI1m40jxutZ2FXU",
        "lat": "lat",
        "lng": "long",
        "delay": 250,
        "force": false,
        /*
        To use Mapbox handler, uncomment the following line and comment out the google handler 
        //"handler": handlers.forwardMapbox
        */
        "handler": handlers.forwardGoogle
        }
        if (!argv.inputcsv) { 
            console.log('Please provide the CSV name (no extension).') 
        } 
        else { 
            console.log("Running Forward Geocoding on " + argv.inputcsv)
            csvgeocode("./geodata/input/" + argv.inputcsv + ".csv", "./geodata/output/" 
            + argv.inputcsv + "ForwardGeocode.csv", options).on("complete", function(summary) {
                if (summary) {
                    console.log(summary)
                }
            })
        }
    }
})

//Reverse Geocode a CSV File from ./geodata/input and Write a new CSV File to ./geodata/output
//include the flag --inputcsv = 'this_is_a_CSV_name' after the rgeo commmand
yargs.command({ 
    command: 'rgeo',
    describe: 'reverse geocode a CSV file',
    builder: {
        inputcsv: {
            describe: 'name of input CSV',
            demandOption: false, 
            type: 'string'
        }
    },
    handler(argv) {
        const options = {
            //"url": "https://api.mapbox.com/geocoding/v5/mapbox.places/{{longitude}},{{latitude}}.json?access_token=pk.eyJ1IjoiY2hhZGxhZ29tYXJzaW5vIiwiYSI6ImNrMzNtM2dndzBuc3UzaXMycXNhbDV3c2UifQ.SiOMsGZ2j0o8NKzbYslP1w",
            "url": "https://maps.googleapis.com/maps/api/geocode/json?latlng={{latitude}},{{longitude}}&key=AIzaSyDfZYegb4O_tj4qGDGvVI1m40jxutZ2FXU",
            "delay": 250,
            "street":"street",
            "city":"city",
            "zipcode":"zipcode",
            "county":"county",
            "state":"state",
            "force": false,
            /*
            To use Mapbox handler, uncomment the following line and comment out the google handler 
            //"handler": handlers.forwardMapbox
            */
            "handler":handlers.reverseGoogle
        }
        if (!argv.inputcsv) { 
            console.log('Please provide the CSV name (no extension).') 
        } 
        else { 
            console.log("Running Reverse Geocoding on " + argv.inputcsv)
            reversecsvgeocode("./geodata/input/" + argv.inputcsv + ".csv", "./geodata/output/"
            + argv.inputcsv + "ReverseGeocode.csv", options).on("complete", function(summary) {
                if (summary) {
                    console.log(summary)
                }
            })
        }
    }
})


yargs.parse()