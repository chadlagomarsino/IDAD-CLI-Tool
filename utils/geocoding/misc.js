module.exports = {
    //Is it numeric and between -180 and +180?
    isNumeric: function(number) {
      return !Array.isArray(number) && (number - parseFloat(number) + 1) >= 0 && number >= -180 && number <= 180;
    },
    //Try to auto-discover missing column names for forward geocode
    discoverOptions: function(options,row) {
  
      for (var key in row) {
        if (options.lat === null && key.trim().match(/^lat(itude)?$/i)) {
          options.lat = key;
          continue;
        }
        if (options.lng === null && key.trim().match(/^lo?ng(itude)?$/i)) {
          options.lng = key;
          continue;
        }
      }
  
      if (options.lat === null) {
        options.lat = "lat";
      }
  
      if (options.lng === null) {
        options.lng = "lng";
      }
  
      return options;
  
    },
    //Try to auto-discover missing column names for reverse geocode
    discoverOptionsReverse: function(options,row) {
  
      for (var key in row) {
        if (options.zipcode === null && key.trim().match(/^zip(code)?$/i)) {
          options.zipcode = key;
          continue;
        }
      }
      return options;
  
    }
  };