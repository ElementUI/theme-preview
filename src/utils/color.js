import color from 'css-color-function';
import formula from './formula.json';

const generateColors = primary => {
  let colors = {};
  let baseBlack = '';
  Object.keys(formula).forEach(key => {
    const value = formula[key].replace(/primary/g, primary).replace(/baseBlack/g, baseBlack);
    colors[key] = color.convert(value);
    if (key === 'baseBlack') {
      baseBlack = colors[key];
    }
  });
  console.log(colors);
  return colors;
};

export default generateColors;
