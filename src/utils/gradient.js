import * as d3 from "d3";

const colorScale = d3.scaleSequential(d3.interpolateRdYlGn);

export const getGradientColor = (domain, value) => {
  colorScale.domain([-domain, domain]);
  return colorScale(value);
};
