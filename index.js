require('dotenv').config()
const https = require('https');
const axios = require('axios');
const postcodes = require('node-postcodes.io')

const querystring = require('querystring');
const { Parser } = require('json2csv');
const json2csvParser = new Parser();

const fs = require('fs')

///////////////////// Breem Getting Data //////////////////////

const getheadersBreem = {
  Authorization: process.env.BREEM_BASIC_AUTH,
  Accept: "application/json"
}

const parametersBreem = {
  country: "United Kingdom",
  // location: "Wales"
}

const get_request_args_Breem = querystring.stringify(parametersBreem);

axios.get(
  "https://api.breeam.com/datav1/assessments?" + get_request_args_Breem,
  {
    headers: getheadersBreem
  }
)
.then((result) => {
    const csv = json2csvParser.parse(result.data.results.assessments.assessment)
    fs.writeFileSync(__dirname + "/CSV/BREEMdata.csv", csv, function(e) {
      console.log(e)
    })
    console.info('\nBREEM API Call Completed');
})
.catch((e) => {
  console.log(e)
})

///////////////// Energy-performance-certificates-non-domestic-buildings-search /////////////////////////

// const getheadersEPC = {
//   Authorization: process.env.EPC_ENCODED_API_KEY,
//   Accept: "application/json"
//   // Accept: "text/csv"
// }

// axios.get(
//   "https://epc.opendatacommunities.org/api/v1/non-domestic/search",
//   {
//     headers: getheadersEPC
//   }
// )
// .then(async (result) => {
//   let EPCdata = await Promise.all(result.data.rows.map(async item => {
//     let map = await postcodes.lookup(item.postcode)
//     return {...item, country: "United Kingdom", longitude: map.result.longitude, latitude:map.result.latitude, county1: map.result.primary_care_trust}
//   }))

//   const csv = json2csvParser.parse(EPCdata)
//   fs.writeFileSync(__dirname + "/CSV/EPCdata.csv", csv, function(e) {
//     console.log(e)
//   })
//   console.info('\nEPC API Call completed');
// })
// .catch((e) => {
//   console.log(e)
// })
