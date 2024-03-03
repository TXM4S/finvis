import * as d3 from "d3";
import Glyph from "./glyph";
import { getGradientColor } from "../utils/gradient";
import { useState, useEffect } from "react";

const Graph = (props) => {
  const { stockData, newsData, handleSetArticles, sentimentDomain } = props;
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

  const setupXAxis = () => {
    if (x == null || y == null) return;

    let container = d3.select("#container");

    d3.select("#xAxis").remove();

    container
      .append("g")
      .attr("id", "xAxis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
  };

  const setupYAxis = () => {
    if (x == null || y == null) return;

    let container = d3.select("#container");
    d3.select("#yAxis").remove();
    container.append("g").attr("id", "yAxis").call(d3.axisLeft(y));
  };

  const setupLine = () => {
    const container = d3.select("#container");

    d3.select("#solid-line").remove();

    let DOMLine = container
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
    const container = d3.select("#container");

    const filteredData = stockData.filter(line.defined());

    d3.select("#gap-line").remove();

    let DOMLine = container
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
    const container = d3.select("#container");

    d3.select(".brush").remove();

    container.append("g").attr("class", "brush").call(brush);
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

      const currentColor = getGradientColor(
        sentimentDomain,
        currentAvgSentiment,
      );
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
          handleMouseOver={() =>
            addToolTip(
              dataPoint.c || dataPoint.ec,
              oneDayWidth * 0.5,
              currentLength,
              timestamp,
              currentAvgSentiment,
            )
          }
        />,
      ]);

      // reorder the glyphs to be on top
      d3.select("#glyphContainer").raise();
    }
  };

  const removeToolTip = () => {
    d3.select("#tooltip").remove();
  };

  const addToolTip = (
    closePrice,
    offset,
    noArticles,
    timestamp,
    avgSentiment,
  ) => {
    const container = d3.select("#container");

    d3.select("#tooltip").remove();

    const domainZero = x.domain()[0].getTime();
    const domainOne = x.domain()[1].getTime();
    const midpoint = domainZero + (domainOne - domainZero) / 2;

    const isright = timestamp > midpoint;
    console.log(timestamp);
    console.log(midpoint);
    console.log(isright);
    console.log(new Date(timestamp).toDateString());

    const width = 180;
    const height = 70;
    const circleX = x(timestamp);
    const circleY = y(closePrice);
    const tooltipX = circleX + (isright ? -(width + 15) : 15);
    const tooltipY = circleY - height / 2;
    const highlightX = circleX + (isright ? -20 : 15);
    const trianglePoints = isright
      ? circleX +
        "," +
        circleY +
        " " +
        (circleX - 20) +
        "," +
        (circleY + 10) +
        " " +
        (circleX - 20) +
        "," +
        (circleY - 10)
      : circleX +
        "," +
        circleY +
        " " +
        (circleX + 20) +
        "," +
        (circleY + 10) +
        " " +
        (circleX + 20) +
        "," +
        (circleY - 10);

    let tooltip = container.append("g").attr("id", "tooltip");
    tooltip
      .append("rect")
      .attr("id", "tooltip-rect")
      .attr("class", "stroke-base-200 fill-neutral shadow-lg")
      .attr("stroke-width", 1)
      .attr("x", tooltipX)
      .attr("y", tooltipY)
      .attr("rx", 5)
      .attr("width", width)
      .attr("height", height);
    tooltip
      .append("rect")
      .attr("class", "fill-primary")
      .attr("x", highlightX)
      .attr("y", tooltipY)
      .attr("width", 5)
      .attr("height", height);
    tooltip
      .append("polygon")
      .attr("points", trianglePoints)
      .attr("class", "fill-primary");
    tooltip
      .append("text")
      .attr("class", "font-bold fill-neutral-content")
      .attr("id", "tooltip-text")
      .attr("x", tooltipX + 10)
      .attr("y", tooltipY + 20)
      .text(new Date(timestamp * 1).toDateString());
    tooltip
      .append("text")
      .attr("class", "font-bold fill-neutral-content")
      .attr("x", tooltipX + 10)
      .attr("y", tooltipY + 40)
      .text("Articles: " + noArticles);
    tooltip
      .append("text")
      .attr("class", "font-bold fill-neutral-content")
      .attr("x", tooltipX + 10)
      .attr("y", tooltipY + 60)
      .text("Avg Sentiment: " + avgSentiment.toFixed(2));
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
    removeToolTip();
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
        <g clipPath="url(#clip)" id="glyphContainer">
          {glyphs}
        </g>
      </g>
    </svg>
  );
};

export default Graph;
