import "../App.css";
import * as d3 from "d3";

const Article = (props) => {
  const { title, author, date, url, sentiment } = props;

  const colorScale = d3.scaleSequential(d3.interpolateRdYlGn).domain([-1, 1]);

  const stringDate = new Date(date).toLocaleDateString();

  const text =
    (sentiment > 0 ? "pos: " : sentiment < 0 ? "neg: " : "neu: ") + sentiment;
  return (
    <div className="card w-64 mb-5 bg-base-200 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        {/*sentiment > 0 ? positive : sentiment < 0 ? negative : neutral*/}
        <div
          className="badge text-base-200"
          style={{ backgroundColor: colorScale(sentiment) }}
        >
          {" "}
          {text}
        </div>
        <p>{author}</p>
        <p>{stringDate}</p>
        <div className="card-actions justify-end">
          <a className="btn btn-primary" href={url}>
            Go To
          </a>
        </div>
      </div>
    </div>
  );
};

export default Article;
