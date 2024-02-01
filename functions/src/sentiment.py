import pandas as pd
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer


df = pd.DataFrame(
    {
        "text": [
            "I love this movie",
            "I hate this movie",
            "New method could make EV motors circular, reducing raw material imports",
            "Fidelity cuts value of X stake, implying 72% drop since Musk paid $44 billion.",
            "not good",
        ],
    }
)

analyser = SentimentIntensityAnalyzer()


def preprocess(text):
    # lowercase all text
    text = text.lower()

    # tokenize text
    tokens = word_tokenize(text)

    # remove stop words
    filtered_tokens = [
        token for token in tokens if token not in stopwords.words("english")
    ]

    # lemmatize text
    lemmatizer = WordNetLemmatizer()
    lemmatized_tokens = [lemmatizer.lemmatize(token) for token in filtered_tokens]

    # reconstruct text
    processed_text = " ".join(lemmatized_tokens)

    return processed_text


def get_sentiment(text):
    score = analyser.polarity_scores(text)
    return score["compound"]


df["text"] = df["text"].apply(preprocess)
df["sentiment"] = df["text"].apply(get_sentiment)

print(df.head())
