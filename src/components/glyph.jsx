const Glyph = (props) => {
  const { x, y, radius, color, handleClick } = props;

  return (
    <circle
      className="glyphs stroke-base-200"
      r={radius}
      cx={x}
      cy={y}
      fill={color}
      onMouseDown={handleClick}
      cursor={"pointer"}
    ></circle>
  );
};

export default Glyph;
