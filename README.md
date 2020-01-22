# IDAD-CLI-Tool

## Purpose

This tool will allow you to forward geocode a local CSV file by searching for an address field, parsing the field into address token, running and API call to a geocoding service, and returning a new CSV file with an appended latitude / longitude field for every row. It also allows for reverse geocoding of a CSV file by searching for a latitude / longitude file and returning a tokenized address.

The defaults are configured for Google's geocoder but it can be configured to work with any other similar geocoding service. There are built-in response handlers for Google, Mapbox and Mapzen (details below).

Make sure that you use this in compliance with the relevant API's terms of service.

## Installation 

1. Install NodeJS and code editor of choice 
2. Download IDAD-CLI-Tool Folder and All Subfolder Directories 
3. Use the terminal to navigate to the IDAD-CLI-Tool folder and run the command `npm init` to initalize npm in project folder. This will install node depenency modules for the main app under the node modules directory. 

## Commands 

Enter the following commands from the project folder to run the geocoding utilities of the application

### Forward Geocoding
`node app.js geo --inputcsv="yourCSVFileNameHere"`

This will search IDAD-Toolkit/geodata/input for a csv file, read that file, and then write a new CSV file to IDAD-Toolkit/geodata/output

### Reverse Geocoding 
`node app.js rgeo --inputcsv="yourCSVFileNameHere"`

This will search IDAD-Toolkit/geodata/output for a csv file, read that file, and then write a new CSV file to IDAD-Toolkit/geodata/input

## Connecting to PostgreSQL 

## Connecting to SAS Visual Analytics 

Questions? Contact Chad Lagomarsino at chadlagomarsino@github.com or chadlagomarsino74@gmail.com 
