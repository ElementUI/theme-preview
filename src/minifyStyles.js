const fs = require('fs');
const path = require('path');
const stylePath = path.join(__dirname, '../src/element-styles');

const transformExample = {
  'teal': 'primary',
  'rgb\\\(1, 117, 117\\\)': 'secondary',
  'rgb\\\(250, 252, 252\\\)': 'darkWhite',
  'rgb\\\(31, 58, 61\\\)': 'baseBlack',
  'rgb\\\(50, 81, 87\\\)': 'lightBlack',
  'rgb\\\(72, 102, 106\\\)': 'extraLightBlack',
  'rgb\\\(131, 160, 165\\\)': 'baseSilver',
  'rgb\\\(151, 184, 190\\\)': 'lightSilver',
  'rgb\\\(191, 215, 217\\\)': 'extraLightSilver',
  'rgb\\\(209, 227, 229\\\)': 'baseGray',
  'rgb\\\(228, 238, 241\\\)': 'lightGray',
  'rgb\\\(238, 245, 246\\\)': 'extraLightGray',
  'rgb\\\(0, 115, 115\\\)': 'buttonActive',
  'rgb\\\(51, 153, 153\\\)': 'buttonHover',
};

fs.readdirSync(stylePath).forEach(file => {
  const filePath = path.join(__dirname, `../src/element-styles/${ file }`);
  let content = fs.readFileSync(filePath, 'utf8');
  Object.keys(transformExample).forEach(key => {
    const value = transformExample[key];
    content = content.replace(new RegExp(key, 'g'), value);
  });
  content = content.replace(/\{\n\s*/g, '{').replace(/\}\n/g, '}').replace(/\n/g, '').replace(/;\s*/g, ';').replace(/`/g, '\'') + '\n';
  fs.writeFileSync(filePath, content);
});