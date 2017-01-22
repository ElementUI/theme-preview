import color from 'css-color-function';
import formula from './formula.json';

const generateColors = primary => {
  let colors = {};
  let baseBlack = '';
  let extraLightBlack = '';
  let extraLightSilver = '';

  Object.keys(formula).forEach(key => {
    const value = formula[key]
      .replace(/primary/g, primary)
      .replace(/baseBlack/g, baseBlack)
      .replace(/extraLightBlack/g, extraLightBlack)
      .replace(/extraLightSilver/g, extraLightSilver);
    colors[key] = color.convert(value);
    if (key === 'baseBlack') {
      baseBlack = colors[key];
    }
    if (key === 'extraLightBlack') {
      extraLightBlack = colors[key];
    }
    if (key === 'extraLightSilver') {
      extraLightSilver = colors[key];
    }
  });
  return colors;
};

export default generateColors;
