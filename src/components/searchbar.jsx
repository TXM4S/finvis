const SearchBar = (props) => {
  const handleSearch = props.handleSearch;
  return (
    <div className="ml-10 card w-fit bg-base-200 shadow-xl">
      <div className="card-body flex-col justify-normal">
        <label className="form-control w-48">
          <div className="label">
            <span className="label-text">Query:</span>
          </div>
          <input
            type="text"
            id="queryInput"
            placeholder="Apple"
            className="input input-bordered w-full max-w-xs"
          />
        </label>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Ticker:</span>
          </div>
          <select
            defaultValue={"AAPL"}
            className="select select-bordered"
            id="tickerSelect"
          >
            <option>AAPL</option>
            <option>TSLA</option>
          </select>
        </label>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Date Range:</span>
          </div>
          <select
            defaultValue={12}
            className="select select-bordered"
            id="dateRangeSelect"
          >
            <option value={1}>1 Month</option>
            <option value={3}>3 Months</option>
            <option value={6}>6 Months</option>
            <option value={12}>1 Year</option>
          </select>
        </label>
        <button className="btn btn-primary mt-auto" onClick={handleSearch}>
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
