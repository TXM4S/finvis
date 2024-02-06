import "../App.css";

const Article = (props) => {
  const { title, author, date, url, sentiment } = props;
  const stringDate = new Date(date).toLocaleDateString();
  const positive = (
    <div className="badge badge-secondary">pos: {sentiment}</div>
  );
  const neutral = <div className="badge badge-primary">neu: {sentiment}</div>;
  const negative = <div className="badge badge-accent">neg: {sentiment}</div>;

  return (
    <div className="card w-64 mb-5 bg-base-200 shadow-xl">
      <div className="card-body">
        <h2 class="card-title">{title}</h2>
        {sentiment > 0 ? positive : sentiment < 0 ? negative : neutral}
        <p>{author}</p>
        <p>{stringDate}</p>
        <div class="card-actions justify-end">
          <a class="btn btn-primary" href={url}>
            Go To
          </a>
        </div>
      </div>
    </div>
  );
};

export default Article;
