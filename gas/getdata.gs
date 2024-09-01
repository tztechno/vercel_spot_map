function doGet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var features = [];

  var pointIndex = headers.indexOf("POINT");
  var nameIndex = headers.indexOf("Name");

  if (pointIndex === -1 || nameIndex === -1) {
    throw new Error("Required columns 'POINT' and 'Name' not found in the spreadsheet.");
  }

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var point = row[pointIndex];
    var name = row[nameIndex];

    if (point && name) {
      // Assuming POINT is in the format "POINT(longitude latitude)"
      var coordinates = point.replace("POINT(", "").replace(")", "").split(" ");
      var lon = parseFloat(coordinates[0]);
      var lat = parseFloat(coordinates[1]);

      features.push({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [lon, lat]
        },
        properties: {
          name: name
        }
      });
    }
  }

  var geoJson = {
    type: "FeatureCollection",
    features: features
  };

  return ContentService.createTextOutput(JSON.stringify(geoJson))
    .setMimeType(ContentService.MimeType.JSON);
}