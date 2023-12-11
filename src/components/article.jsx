import '../styles/article.css'


const Article = (props) => {

    const {title, author , date, url} = props;
    const stringDate = new Date(date).toLocaleDateString();

    return(
        <div className="container">
            <h1>{title}</h1>
            <p>{author}</p>
            <p>{stringDate}</p>
            <a href={url}>{url}</a>
        </div>

    )
}

export default Article;