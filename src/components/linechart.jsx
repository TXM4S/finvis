import * as d3 from "d3";
import "../App.css";

const LineChart = (props) => {
  const { stockData, newsData, width, height, handleSetArticles } = props;
  let idleTimeout;
  const idled = () => {
    idleTimeout = null;
  };
  console.log(stockData);

  const margin = { top: 20, right: 30, bottom: 30, left: 40 };

  console.log(newsData);

  const x = d3
    .scaleUtc()
    .domain(d3.extent(stockData, (d) => d.t))
    .range([margin.left, width - margin.right]);

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

  const getGlyphs = () => {
    if (!newsData) return null;

    console.log(colorScale(0.5));

    const glyphs = [];
    const maxLength = Math.max(
      ...Object.values(newsData).map((articles) => articles.length),
    );
    for (const article in newsData) {
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
      const radius = (newsData[article].length / maxLength) * 10;
      const date = new Date(parseInt(article)).toLocaleDateString();
      const tooltipText = `${date} ${newsData[article].length} articles`;
      glyphs.push(
        <circle
          className="glyphs stroke-base-200"
          key={article}
          cx={x(article)}
          cy={cy}
          r={radius}
          fill={colorScale(averageSentiment)}
          onMouseDown={(e) => {
            console.log(newsData[article]);
            handleSetArticles(newsData[article]);
          }}
          cursor={"pointer"}
        />,
      );
    }
    return glyphs;
  };

  const updateChart = (event) => {
    const extent = event.selection;
  
    if (!extent) {
      if (!idleTimeout) return (idleTimeout = setTimeout(idled, 350));
      x.domain(d3.extent(stockData, (d) => d.t));
    } else {
      x.domain([x.invert(extent[0]), x.invert(extent[1])]);
      d3.select(".brush").call(brush.move, null);
    }
  
    // Update the line and area paths with the new x-domain
    d3.select("#line").attr("d", line(stockData));
    d3.select("#gradient").attr("d", area(stockData));
  
    // Update the glyphs with the new x-domain
    d3.selectAll(".glyphs")
    .attr("cx", function(d, i) {
      // Find the corresponding data point in stockData
      const stock = stockData.find((d) => d.t == d3.select(this).attr("key"));
  
      // If the data point exists, return the new cx value
      if (stock) {
        return x(stock.t);
      }
  
      // If the data point doesn't exist, return the current cx value
      return d3.select(this).attr("cx");
    });
  
    // Update the x-axis with the new domain
    d3.select(".xAxis")
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
          <path fill="url(#gradient)" d={area(stockData)} />
          <g ref={(node) => d3.select(node).call(xAxis)} />
          <g ref={(node) => d3.select(node).call(yAxis)} />
          <g ref={(node) => d3.select(node).call(brush)} className="brush"></g>
          {getGlyphs()}
        </g>
      </svg>
    </div>
  );
};

export default LineChart;
