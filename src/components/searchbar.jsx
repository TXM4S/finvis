
const SearchBar = (props) => {

  const handleSearch = props.handleSearch
  return (
    <div className="card w-fit bg-base-200 shadow-xl">
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
        <label class="form-control w-full max-w-xs">
          <div class="label">
            <span class="label-text">Ticker:</span>
          </div>
          <select class="select select-bordered" id="tickerSelect">
            <option selected>AAPL</option>
            <option>TSLA</option>
          </select>
        </label>
        <button className="btn btn-primary mt-auto" onClick={handleSearch}>Search</button>
      </div>
    </div>
  )
}

export default SearchBar;
