import * as d3 from "d3";
import "../App.css";

const LineChart = (props) => {
  const { stockData, newsData, width, height, handleSetArticles } = props;
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
    g.attr("transform", `translate(0,${height - margin.bottom})`).call(
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
      const cy = stock.c != null ? y(stock.c) : y(stock.ec);
      const radius = (newsData[article].length / maxLength) * 10;
      const date = new Date(parseInt(article)).toLocaleDateString();
      const tooltipText = `${date} ${newsData[article].length} articles`;
      glyphs.push(
        <circle
          className="stroke-base-200"
          key={article}
          cx={x(article)}
          cy={cy}
          r={radius}
          fill="oklch(var(--p))"
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

  return (
    <div className="linechart">
      <div id="tooltip"></div>
      <svg width={width} height={height}>
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(var(--p))" stopOpacity={0.8} />
            <stop offset="100%" stopColor="oklch(var(--p))" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="legendGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="oklch(var(--a))" />
            <stop offset="50%" stopColor="oklch(var(--p))" />
            <stop offset="100%" stopColor="oklch(var(--s))" />
          </linearGradient>
        </defs>
        <g fill="none">
          <path
            className="stroke-primary"
            strokeWidth="3"
            d={line(stockData)}
          />
          <path fill="url(#gradient)" d={area(stockData)} />
          <g ref={(node) => d3.select(node).call(xAxis)} />
          <g ref={(node) => d3.select(node).call(yAxis)} />
          {getGlyphs()}
        </g>
        <rect
          x={20}
          y={height - 50}
          width={100}
          height={10}
          fill="url(#legendGradient)"
        />
        <text x={20} y={height - 35} fontSize={10} fill={"white"}>
          -1
        </text>
        <text x={120} y={height - 35} fontSize={10} fill={"white"}>
          1
        </text>
      </svg>
    </div>
  );
};

export default LineChart;
