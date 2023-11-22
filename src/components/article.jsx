import '../styles/article.css'


const Article = (props) => {

    const {title, author , date, url} = props;

    return(
        <div className="container">
            <h1>{title}</h1>
            <p>{author}</p>
            <p>{date}</p>
            <a href={url}>{url}</a>
        </div>

    )
}

export default Article;