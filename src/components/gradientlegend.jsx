const GradientLegend = ({ width, height }) => {
  return (
    <svg width={width} height={height}>
      <defs>
        <linearGradient id="legendGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="oklch(var(--a))" />
          <stop offset="50%" stopColor="oklch(var(--p))" />
          <stop offset="100%" stopColor="oklch(var(--s))" />
        </linearGradient>
      </defs>
      <rect
        width={width}
        height={height / 2}
        rx={5}
        ry={5}
        fill="url(#legendGradient)"
      />
      <text x="3" y={height - 3} className="text-xs fill-white">
        negative
      </text>
      <text
        x={width / 2}
        y={height - 3}
        className="text-xs fill-white"
        textAnchor="middle"
      >
        neutral
      </text>
      <text
        x={width - 3}
        y={height - 3}
        className="text-xs fill-white"
        textAnchor="end"
      >
        positive
      </text>
    </svg>
  );
};

export default GradientLegend;
