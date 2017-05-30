let XLSX = require('xlsx');

function array2excel(data, ws_name = 'new sheet name') {
  // worksheet
  var ws = XLSX.utils.aoa_to_sheet(data);

  // workbook
  var wb = {
    SheetNames: [],
    Sheets: {}
  };

  // Add the sheet name to the list
  wb.SheetNames.push(ws_name);

  wb.Sheets[ws_name] = ws;

  // export workbook
  XLSX.writeFile(wb, 'out.xlsx');
}

// data
var data = [
  [1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10],
  'hello'.split(''),
  'world'.split('')
];

array2excel(data);
