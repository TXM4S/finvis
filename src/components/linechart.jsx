import * as d3 from "d3";
import { useState, useEffect } from "react";
import "../App.css";

const LineChart = (props) => {
  const { stockData, newsData, width, height, handleSetArticles } = props;
  const [domain, setDomain] = useState(null);
  const [glyphs, setGlyphs] = useState([]);
  let idleTimeout;
  const idled = () => {
    idleTimeout = null;
  };
  console.log(stockData);

  const margin = { top: 20, right: 30, bottom: 30, left: 40 };

  console.log(newsData);

  let x = d3
    .scaleUtc()
    .domain(d3.extent(stockData, (d) => d.t))
    .range([margin.left, width - margin.right]);

  if (domain) {
    x = d3
      .scaleUtc()
      .domain(domain)
      .range([margin.left, width - margin.right]);
  }

  const startDate = x.domain()[0];
  const nextDay = new Date(startDate);
  nextDay.setUTCDate(startDate.getUTCDate() + 1);

  d3.select("#xAxis")
    .transition()
    .duration(1000)
    .call(d3.axisBottom(x).ticks(width / 80));

  const y = d3
    .scaleLinear()
    .domain([d3.min(stockData, (d) => d.c) - 20, d3.max(stockData, (d) => d.c)])
    .nice()
    .range([height - margin.bottom, margin.top]);

  const line = d3
    .line()
    .defined((d) => !isNaN(d.c) && d.c != null)
    .x((d) => x(d.t))
    .y((d) => y(d.c));

  const area = d3
    .area()
    .defined((d) => !isNaN(d.c) && d.c != null)
    .x(line.x())
    .y1(line.y())
    .y0(y(d3.min(stockData, (d) => d.c) - 20));

  const colorScale = d3
    .scaleLinear()
    .domain([-1, 0, 1])
    // --a, --p, --s
    .range(["#00c7b5", "#7582ff", "#ff71cf"]);

  const xAxis = (g) =>
    g
      .attr("id", "xAxis")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(width / 80)
          .tickSizeOuter(0),
      );

  const yAxis = (g) =>
    g
      .attr("transform", `translate(${margin.left},0)`)
      .call(
        d3
          .axisLeft(y)
          .ticks(height / 80)
          .tickSizeOuter(0),
      )
      .call((g) =>
        g
          .select(".tick:last-of-type text")
          .clone()
          .attr("x", 3)
          .attr("text-anchor", "start")
          .attr("font-weight", "bold"),
      );

  const generateGlyphs = (xStart, xEnd) => {
    if (!newsData) return null;

    console.log(colorScale(0.5));
    const oneDayWidth = x(nextDay) - x(startDate);

    const tempGlyphs = [];
    const maxLength = Math.max(
      ...Object.values(newsData).map((articles) => articles.length),
    );
    for (const article in newsData) {
      // Convert article to a number for comparison
      const articleNum = parseInt(article);
      // Check if article is within the x-range
      if (articleNum < xStart || articleNum > xEnd) continue;

      const stock = stockData.find((d) => {
        return d.t == article;
      });

      const articleObj = newsData[article];
      const averageSentiment =
        articleObj.reduce((acc, curr) => {
          return acc + (curr.s ? curr.s : 0);
        }, 0) / articleObj.length;

      console.log(averageSentiment);

      const cy = stock.c != null ? y(stock.c) : y(stock.ec);
      const radius = (newsData[article].length / maxLength) * oneDayWidth * 0.5;
      const date = new Date(articleNum).toLocaleDateString();
      const tooltipText = `${date} ${newsData[article].length} articles`;
      tempGlyphs.push(
        <circle
          className="glyphs stroke-base-200"
          key={article}
          cx={x(article)}
          cy={cy}
          r={radius}
          fill={colorScale(averageSentiment)}
          onMouseDown={(e) => {
            e.stopPropagation();
            console.log(newsData[article]);
            handleSetArticles(newsData[article]);
          }}
          cursor={"pointer"}
        />,
      );
    }
    return tempGlyphs;
  };

  const updateChart = (event) => {
    const extent = event.selection;

    if (!extent) {
      if (!idleTimeout) return (idleTimeout = setTimeout(idled, 350));
      x.domain(d3.extent(stockData, (d) => d.t));
      setDomain(d3.extent(stockData, (d) => d.t));
    } else {
      x.domain([x.invert(extent[0]), x.invert(extent[1])]);
      setDomain([x.invert(extent[0]), x.invert(extent[1])]);
      d3.select(".brush").call(brush.move, null);
    }

    // Update the line and area paths with the new x-domain
    d3.select("#line").transition().attr("d", line(stockData));
    d3.select("#area").transition().attr("d", area(stockData));

    // Remove old glyphs
    //d3.selectAll(".glyphs").remove();

    const xStart = x.domain()[0].getTime();
    const xEnd = x.domain()[1].getTime();
    const newGlyphs = generateGlyphs(xStart, xEnd);
    setGlyphs(newGlyphs);

    // Update the x-axis with the new domain
    d3.select("#xAxis")
      .transition()
      .duration(1000)
      .call(d3.axisBottom(x).ticks(width / 80));
  };

  const brush = d3
    .brushX()
    .extent([
      [0, 0],
      [width, height],
    ])
    .on("end", updateChart);

  useEffect(() => {
    if (stockData && stockData.length > 0) {
      const xDomain = d3.extent(stockData, (d) => d.t);
      setDomain(xDomain);

      const xStart = x.domain()[0].getTime();
      const xEnd = x.domain()[1].getTime();
      const newGlyphs = generateGlyphs(xStart, xEnd);
      setGlyphs(newGlyphs);
    }
  }, [stockData, newsData]);

  return (
    <div className="linechart">
      <div id="tooltip"></div>
      <svg width={width} height={height}>
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(var(--p))" stopOpacity={0.8} />
            <stop offset="100%" stopColor="oklch(var(--p))" stopOpacity={0} />
          </linearGradient>
          <clipPath id="clip">
            <rect width={width} height={height} x={0} y={0}></rect>
          </clipPath>
        </defs>
        <g id="lineholder" fill="none">
          <path
            id="line"
            className="stroke-primary"
            strokeWidth="3"
            d={line(stockData)}
          />
          <path id="area" fill="url(#gradient)" d={area(stockData)} />
          <g
            id="xAxis"
            transform={"translate(0," + (height - margin.bottom) + ")"}
          />
          <g ref={(node) => d3.select(node).call(yAxis)} />
          <g ref={(node) => d3.select(node).call(brush)} className="brush"></g>
          {glyphs}
        </g>
      </svg>
    </div>
  );
};

export default LineChart;
