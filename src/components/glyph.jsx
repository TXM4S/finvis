const Glyph = (props) => {
  const { x, y, radius, color, handleClick, handleMouseOver } = props;

  return (
    <circle
      className="glyphs stroke-base-200"
      r={radius}
      cx={x}
      cy={y}
      fill={color}
      onMouseDown={handleClick}
      onMouseOver={handleMouseOver}
      cursor={"pointer"}
    ></circle>
  );
};

export default Glyph;
