import * as d3 from 'd3';
import { brushX } from 'd3-brush';

const LineChart = (props) => {
    
    const { data, width, height, handleRangeChange} = props;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };

    const x = d3.scaleUtc()
        .domain(d3.extent(data, d => d.t))
        .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
        .domain([d3.min(data, d => d.c) - 20, d3.max(data, d => d.c)]).nice()
        .range([height - margin.bottom, margin.top]);

    const line = d3.line()
        .defined(d => !isNaN(d.c))
        .x(d => x(d.t))
        .y(d => y(d.c));

    const area = d3.area()
        .defined(line.defined())
        .x(line.x())
        .y1(line.y())
        .y0(y(d3.min(data, d => d.c) - 20));

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

    const brushed = ({selection}) => {
        if (selection) {
            let [x0, x1] = selection.map(x.invert);
            x.domain([x0, x1]);
            const newData = data.filter(d => d.t >= x0 && d.t <= x1);
            y.domain([d3.min(newData, d => d.c) - 20, d3.max(newData, d => d.c)]).nice();
            d3.select('.line-path').attr('d', line(newData));
            d3.select('.area-path').attr('d', area(newData));
            d3.select('.x-axis').call(xAxis);
            d3.select('.y-axis').call(yAxis);

            handleRangeChange([x0, x1]);
        }
    };
        
    const brush = brushX()
        .extent([[margin.left, margin.top], [width - margin.right, height - margin.bottom]])
        .on("end", brushed);
            
    return (
        <svg width={width} height={height}>
            <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="steelblue" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="steelblue" stopOpacity={0}/>
                </linearGradient>
            </defs>
            <g fill="none">
                <path stroke="steelblue" strokeWidth="3" d={line(data)} />
                <path fill="url(#gradient)" d={area(data)} />
                <g ref={node => d3.select(node).call(xAxis)} />
                <g ref={node => d3.select(node).call(yAxis)} />
            </g>
            <g fill="none">
                <g className="brush" ref={node => d3.select(node).call(brush)} />
            </g>
        </svg>
    );
};

export default LineChart;