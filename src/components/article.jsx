import "../App.css";
import { getGradientColor } from "../utils/gradient";

const Article = (props) => {
  const { title, author, date, url, sentiment, sentimentDomain } = props;

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
          style={{
            backgroundColor: getGradientColor(sentimentDomain, sentiment),
          }}
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
