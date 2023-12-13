import "../App.css";

const Article = (props) => {
  const { title, author, date, url } = props;
  const stringDate = new Date(date).toLocaleDateString();

  return (
    <div className="card w-96 mb-5 bg-base-200 shadow-xl">
      <div className="card-body">
        <h2 class="card-title">{title}</h2>
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
