const fs = require('fs');
const path = require('path');

const transformExample = {
  '#20a0ff': 'primary',
  '#0190fe': 'secondary',
  '#fbfdff': 'darkWhite',
  '#1f2d3d': 'baseBlack',
  '#324157': 'lightBlack',
  '#48576a': 'extraLightBlack',
  '#8391a5': 'baseSilver',
  '#97a8be': 'lightSilver',
  '#bfcbd9': 'extraLightSilver',
  '#d1dbe5': 'baseGray',
  '#e4e8f1': 'lightGray',
  '#eef1f6': 'extraLightGray',
  '#1d90e6': 'buttonActive',
  '#4db3ff': 'buttonHover',
  '#dfe6ec': 'tableBorder',
  '#d2ecff': 'datepickerInRange',
  '#afddff': 'datepickerInRangeHover',
  '#1c8de0': 'selectOptionSelected',
  '#edf7ff': 'lightBackground'
};

const inputPath = path.join(__dirname, '../node_modules/element-ui/lib/theme-default/index.css');
const outputPath = path.join(__dirname, '../src/style.js');

let content = fs.readFileSync(inputPath, 'utf8');
Object.keys(transformExample).forEach(key => {
  const value = transformExample[key];
  content = content.replace(new RegExp(key, 'ig'), value);
});
content = content.replace(/\\/g, '\\\\').replace(/'/g, '\\\'');
content = `export default '${ content }';\n`;
fs.writeFileSync(outputPath, content);
