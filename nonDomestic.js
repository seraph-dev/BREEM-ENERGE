require("dotenv").config();
const https = require("https");
const axios = require("axios");
const postcodes = require("node-postcodes.io");

const querystring = require("querystring");
const { Parser } = require("json2csv");
const csv = require("csvtojson");
const json2csvParser = new Parser();

const fs = require("fs");

///////////////// Local Energy-performance-certificates-non-domestic-buildings-search /////////////////////////

const getheadersEPC = {
  Authorization: process.env.EPC_ENCODED_API_KEY,
  Accept: "application/json",
  // Accept: "text/csv"
};

const csvFilePath = __dirname + "/CSV/A.csv";
csv()
  .fromFile(csvFilePath)
  .then(async (jsonArray) => {
    var flagAuthority, city, latitude, longitude, count=0, newArray=[];
    
    try{
      // newArray = jsonArray.map(async (item) => {
        // 
        for (let i=0; i<jsonArray.length; i++) {
            let item = jsonArray[i];
            if (flagAuthority == item["Local Authority Code"]) {
              console.log(city)
            newArray.push({...item, city, latitude, longitude, country: "United Kingdom"})
              
          } else {
            flagAuthority = item["Local Authority Code"];
            let locationInfo= await axios.get(
              "https://findthatpostcode.uk/areas/" + item["Local Authority Code"] + ".json"
              )
            
            if (locationInfo.data.included[0].attributes.cty) {
              let cityAuthority = locationInfo.data.included[0].attributes.cty;
              console.log(count++, cityAuthority);
              latitude = locationInfo.data.included[0].attributes.lat;
              longitude = locationInfo.data.included[0].attributes.long;
              let locationInfo2= await axios.get(
                "https://findthatpostcode.uk/areas/" + cityAuthority + ".json"
                )
              city = locationInfo2.data.data.attributes.name;
              newArray.push({...item, city, latitude, longitude, country: "United Kingdom"})
            } else {
              latitude = null;
              longitude = null;
              city = null;
              newArray.push({...item, city, latitude, longitude, country: "United Kingdom"})
            }
          }
        }
    } catch(e) {console.log(e)}

    const csv = json2csvParser.parse(newArray)
    fs.writeFileSync(__dirname + "/CSV/EPCdata_A.csv", csv, function(e) {
      console.log(e)
    })
    console.info('\nEPC_A Data completed');
  });