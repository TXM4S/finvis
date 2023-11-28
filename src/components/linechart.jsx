import * as d3 from 'd3';

const LineChart = (props) => {
    
    const { stockData, newsData, width, height } = props;
    const articles = newsData.articles;
    console.log(stockData)

    const margin = { top: 20, right: 30, bottom: 30, left: 40 };

    console.log(articles)

    const x = d3.scaleUtc()
        .domain(d3.extent(stockData, d => d.t))
        .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
        .domain([d3.min(stockData, d => d.c) - 20, d3.max(stockData, d => d.c)]).nice()
        .range([height - margin.bottom, margin.top]);

    const line = d3.line()
        .defined(d => !isNaN(d.c))
        .x(d => x(d.t))
        .y(d => y(d.c));

    const area = d3.area()
        .defined(line.defined())
        .x(line.x())
        .y1(line.y())
        .y0(y(d3.min(stockData, d => d.c) - 20));

    const xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

    const yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(height / 80).tickSizeOuter(0))
        .call(g => g.select(".tick:last-of-type text").clone()
            .attr("x", 3)
            .attr("text-anchor", "start")
            .attr("font-weight", "bold"));

    return (
        <svg width={width} height={height}>
            <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="steelblue" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="steelblue" stopOpacity={0}/>
                </linearGradient>
            </defs>
            <g fill="none">
                <path stroke="steelblue" strokeWidth="3" d={line(stockData)} />
                <path fill="url(#gradient)" d={area(stockData)} />
                <g ref={node => d3.select(node).call(xAxis)} />
                <g ref={node => d3.select(node).call(yAxis)} />
                {articles && articles.map((article, index) => {
                    const articleDate = new Date(article.publishedAt);
                    //set it to 00:00 on the day
                    articleDate.setHours(0,0,0,0);
                    console.log(articleDate)
                    // Find the corresponding stockData object
                    const stock = stockData.find(d => {
                        const stockDate = new Date(d.t);
                        stockDate.setHours(0,0,0,0);
                        return stockDate.getTime() === articleDate.getTime();
                    });
                    // Calculate the cy attribute
                    const cy = stock ? y(stock.c) : height / 2;
                    return <circle key={index} cx={x(articleDate)} cy={cy} r={5} fill="red" />;
                })}
            </g>
        </svg>
    );
};

export default LineChart;