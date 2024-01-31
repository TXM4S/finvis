const MenuItem = ({ name, dateRange, handleClick }) => {
  return (
    <li>
      <div onClick={handleClick}>
        <p>
          <span className="text-lg">{name}</span>
          <br />
          <span className="badge badge-primary text-xs">{dateRange}</span>
        </p>
      </div>
    </li>
  );
};

export default MenuItem;
