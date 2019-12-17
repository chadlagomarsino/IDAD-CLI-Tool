const csv = require("dsv")(",");

module.exports = {
  forwardGoogle: function(body) {

    var response = JSON.parse(body);

    //Success, return a lat/lng object
    if (response.results && response.results.length) {
      return response.results[0].geometry.location;
    }

    //No match, return a string
    if (response.status === "ZERO_RESULTS" || response.status === "OK") {
      return "NO MATCH";
    }

    //Other error, return a string
    return response.status + (response.error_message && response.error_message.length ? ": " + response.error_message : "");

  },
  reverseGoogle: function(body) {

    // function getAddressObject(address_parts) {
    //   console.log("running function")
    //   var ShouldBeComponent = {
    //     parsed_home: ["street_number"],
    //     parsed_postal_code: ["postal_code"],
    //     parsed_street: ["street_address", "route"],
    //     parsed_region: [
    //       "administrative_area_level_1",
    //       "administrative_area_level_2",
    //       "administrative_area_level_3",
    //       "administrative_area_level_4",
    //       "administrative_area_level_5"
    //     ],
    //     parsed_city: [
    //       "locality",
    //       "sublocality",
    //       "sublocality_level_1",
    //       "sublocality_level_2",
    //       "sublocality_level_3",
    //       "sublocality_level_4"
    //     ],
    //     parsed_country: ["country"]
    //   };

    //   var parsed_address = {
    //     parsed_home: "",
    //     parsed_postal_code: "",
    //     parsed_street: "",
    //     parsed_region: "",
    //     parsed_city: "",
    //     parsed_country: ""
    //   };
    //   address_parts.forEach(component => {
    //     for (var shouldBe in ShouldBeComponent) {
    //       if (ShouldBeComponent[shouldBe].indexOf(component.types[0]) !== -1) {
    //         if (shouldBe === "parsed_country") {
    //           address[shouldBe] = component.short_name;
    //         } else {
    //           address[shouldBe] = component.long_name;
    //         }
    //       }
    //     }
    //   });
    //   console.log(parsed_address)
    //   return {
    //     parsed_address
    //   }
    // }

    let response = JSON.parse(body)

    // //console.log(`response: ${response}`)

    // //addressObject = getAddressObject(response.results[0].address_components)
    // //console.log(addressObject)

    //Success, return objects
    if (response.results && response.results.length) {

      let parsed_street = ''
      for (var i = 0; i < response.results[0].address_components.length; i++) {
        for (var j = 0; j < response.results[0].address_components[i].types.length; j++) {
          if (response.results[0].address_components[i].types[j] == "route") {
            parsed_street = response.results[0].address_components[i].long_name;
          }
        }
      }
      let parsed_zipcode = ''
      for (var i = 0; i < response.results[0].address_components.length; i++) {
        for (var j = 0; j < response.results[0].address_components[i].types.length; j++) {
          if (response.results[0].address_components[i].types[j] == "postal_code") {
            parsed_zipcode = response.results[0].address_components[i].long_name;
          }
        }
      }
      let parsed_city = ''
      for (var i = 0; i < response.results[0].address_components.length; i++) {
        for (var j = 0; j < response.results[0].address_components[i].types.length; j++) {
          if (response.results[0].address_components[i].types[j] == "locality") {
            parsed_city = response.results[0].address_components[i].long_name;
          }
        }
      }
      let parsed_state = ''
      for (var i = 0; i < response.results[0].address_components.length; i++) {
        for (var j = 0; j < response.results[0].address_components[i].types.length; j++) {
          if (response.results[0].address_components[i].types[j] == "administrative_area_level_1") {
            parsed_state = response.results[0].address_components[i].short_name;
          }
        }
      }
      let parsed_county = ''
      for (var i = 0; i < response.results[0].address_components.length; i++) {
        for (var j = 0; j < response.results[0].address_components[i].types.length; j++) {
          if (response.results[0].address_components[i].types[j] == "administrative_area_level_2") {
            parsed_county = response.results[0].address_components[i].long_name;
          }
        }
      }

      return {
        street: parsed_street,
        city: parsed_city,
        zipcode: parsed_zipcode,
        county: parsed_county,
        state: parsed_state,
      // street: `${response.results[0].address_components[0].long_name} ${response.results[0].address_components[1].long_name}`,
      // zipcode: response.results[0].address_components[7].long_name,
      // city: response.results[0].address_components[3].long_name,
      // state: response.results[0].address_components[6].long_name,
      // county: response.results[0].address_components[5].long_name
      }
    }

    //No match, return a string
    if (response.status === "ZERO_RESULTS" || response.status === "OK") {
      return "NO MATCH";
    }

    //Other error, return a string
    return response.status + (response.error_message && response.error_message.length ? ": " + response.error_message : "");

  },
  forwardMapbox: function(body) {
    
    var response = JSON.parse(body);

    if (response.features === undefined) {
      return response.message;
    } else if (!response.features.length) {
      return "NO MATCH";
    }

    return {
      lat: response.features[0].center[1],
      lng: response.features[0].center[0]
    };

  },
  reverseMapbox: function(body) {
    
    var response = JSON.parse(body);

    if (response.features === undefined) {
      return response.message;
    } else if (!response.features.length) {
      return "NO MATCH";
    }

    return {
      street: response.features[0].context[0].text,
      zipcode: response.features[0].context[1].text,
      city: response.features[0].context[2].text,
      state: response.features[0].context[3].text
    };

  },
  osm: function(body) {

    var parsed;

    if (!body.length) {
      return "NO RESPONSE BODY RETURNED, CHECK YOUR API KEY";
    }

    try {
      parsed = JSON.parse(body);
    } catch(e) {
      return "ERROR PARSING RESPONSE: "+body;
    }

    if (!Array.isArray(parsed)) {
      return "UNEXPECTED RESPONSE: "+body;
    }

    if (!parsed.length) {
      return "NO MATCH";
    }

    return {
      lat: parsed[0].lat,
      lng: parsed[0].lon
    };

  }
};