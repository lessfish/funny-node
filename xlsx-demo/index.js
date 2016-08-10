/*
* see more
* @https://scarletsky.github.io/2016/01/30/nodejs-process-excel/
* @http://www.mystorp.com/2015/11/07/nodejs-process-excel/
* @https://aotu.io/notes/2016/04/07/node-excel/
*/


// 引入 xlsx 模块
// https://github.com/SheetJS/js-xlsx
var xlsx = require("xlsx");

// workbook 对象表示整份 Excel 文档
// 一个 workbook 对象包含了 N 个 sheets（看 Excel 文档的左下角）
var workbook = xlsx.readFileSync('1.xlsx');


// 打印出每个 sheet 的 name
for (var i in workbook.SheetNames)
  console.log(workbook.SheetNames[i]);

// 获取第一个 sheet 的名字
var firstSheetName = workbook.SheetNames[0];

// 获取第一个 sheet 对象
// 通过表名获取表格
var sheet = workbook.Sheets[firstSheetName];

// 返回表的有效范围
// A1:E180
// console.log(sheet['!ref']);

// 返回合并过的单元格
// console.log(sheet['!merges']);

// cell 对象，指的是 sheet 中的单元格，一个单元格就是一个 cell 对象
// 一行 A 列
// 对于多个单元格合并的大 cell，取左上角的单元格表示
// 别的单元格显示 undefined
var cell = sheet["A1"];
console.log(cell);

// the value of a cell
console.log(cell.v);