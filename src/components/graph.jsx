import * as d3 from "d3";
import Glyph from "./glyph";
import { useState, useEffect } from "react";

const Graph = (props) => {
  const { stockData, newsData, handleSetArticles } = props;
  const margin = { top: 30, right: 30, bottom: 30, left: 30 };
  let width = props.width - margin.left - margin.right;
  let height = props.height - margin.top - margin.bottom;

  let idleTimeout = null;
  const idled = () => {
    idleTimeout = null;
  };

  const [glyphs, setGlyphs] = useState([]);

  let x = d3
    .scaleTime()
    .domain(d3.extent(stockData, (d) => d.t))
    .nice()
    .range([0, width]);

  const y = d3
    .scaleLinear()
    .domain([d3.min(stockData, (d) => d.c) - 20, d3.max(stockData, (d) => d.c)])
    .nice()
    .range([height, 0]);

  const line = d3
    .line()
    .defined((d) => !isNaN(d.c) && d.c != null)
    .x((d) => x(d.t))
    .y((d) => y(d.c));

  const colorScale = d3.scaleSequential(d3.interpolateRdYlGn);
  colorScale.domain([-1, 1]);

  const setupXAxis = () => {
    if (x == null || y == null) return;

    let svg = d3.select("#container");

    d3.select("#xAxis").remove();

    svg
      .append("g")
      .attr("id", "xAxis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
  };

  const setupYAxis = () => {
    if (x == null || y == null) return;

    let svg = d3.select("#container");
    d3.select("#yAxis").remove();
    svg.append("g").attr("id", "yAxis").call(d3.axisLeft(y));
  };

  const setupLine = () => {
    const svg = d3.select("#container");

    d3.select("#solid-line").remove();

    let DOMLine = svg
      .append("g")
      .attr("id", "solid-line")
      .attr("clip-path", "url(#clip)");
    DOMLine.append("path")
      .datum(stockData)
      .attr("class", "line stroke-primary")
      .attr("fill", "none")
      .attr("stroke-width", 1.5)
      .attr("d", line(stockData));
  };

  const setupGapLine = () => {
    const svg = d3.select("#container");

    const filteredData = stockData.filter(line.defined());

    d3.select("#gap-line").remove();

    let DOMLine = svg
      .append("g")
      .attr("id", "gap-line")
      .attr("clip-path", "url(#clip)");
    DOMLine.append("path")
      .attr("class", "line stroke-primary")
      .attr("fill", "none")
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", "1,1")
      .attr("d", line(filteredData));
  };

  const setupBrush = () => {
    const svg = d3.select("#container");

    d3.select(".brush").remove();

    svg.append("g").attr("class", "brush").call(brush);
  };

  const setupGlyphs = () => {
    const oneDayWidth =
      x(new Date(stockData[1].t)) - x(new Date(stockData[0].t));

    const maxArticles = Math.max(
      ...Object.values(newsData).map((array) => array.length),
    );

    d3.select("#glyphContainer").selectAll("*").remove();

    for (const timestamp in newsData) {
      if (timestamp === 0) continue;

      const currentDaysArticles = newsData[timestamp];

      const currentLength = currentDaysArticles.length;
      const currentRadius = (currentLength / maxArticles) * oneDayWidth * 0.5;

      const currentAvgSentiment =
        currentDaysArticles.reduce((acc, curr) => {
          return acc + curr.s;
        }, 0) / currentLength;

      console.log(currentAvgSentiment);

      const currentColor = colorScale(currentAvgSentiment);
      console.log(currentColor);

      const glyphX = x(timestamp);
      /*eslint-disable-next-line*/
      const dataPoint = stockData.find((d) => d.t == timestamp);
      let glyphY = 0;
      if (dataPoint) {
        glyphY = y(dataPoint.c || dataPoint.ec);
      } else {
        continue;
      }

      setGlyphs((array) => [
        ...array,
        <Glyph
          className="z-10"
          x={glyphX}
          y={glyphY}
          radius={currentRadius}
          color={currentColor}
          handleClick={() => handleSetArticles(currentDaysArticles)}
        />,
      ]);

      // reorder the glyphs to be on top
      d3.select("#glyphContainer").raise();
    }
  };

  const addDoubleClick = () => {
    const svg = d3.select("#svg");

    svg.on("dblclick", () => {
      x.domain(d3.extent(stockData, (d) => d.t));
      rerender();
    });
  };

  const zoom = (event) => {
    const extent = event.selection;

    if (!extent) {
      if (!idleTimeout) return (idleTimeout = setTimeout(idled, 350));
      x.domain(d3.extent(stockData, (d) => d.t));
    } else {
      x.domain([x.invert(extent[0]), x.invert(extent[1])]);
      d3.select(".brush").call(brush.move, null);
    }

    rerender();
  };

  const brush = d3
    .brushX()
    .extent([
      [0, 0],
      [width, height],
    ])
    .on("end", zoom);

  const rerender = () => {
    setupXAxis();
    setupYAxis();
    setupLine();
    setupGapLine();
    setupBrush();
    setupGlyphs();
  };

  useEffect(() => {
    rerender();
    addDoubleClick();
    /*eslint-disable-next-line*/
  }, [stockData]);

  return (
    <svg id="svg" width={props.width} height={props.height}>
      <defs>
        <clipPath id="clip">
          <rect width={width} height={height} x={0} y={0}></rect>
        </clipPath>
      </defs>
      <g
        id="container"
        transform={"translate(" + margin.left + "," + margin.top + ")"}
      >
        <g id="glyphContainer">{glyphs}</g>
      </g>
    </svg>
  );
};

export default Graph;
