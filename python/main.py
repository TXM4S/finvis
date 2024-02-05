# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

from firebase_functions import https_fn
from firebase_admin import initialize_app
from typing import Any


from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

initialize_app()


@https_fn.on_call(region="europe-west2")
def sentiment(req: https_fn.CallableRequest) -> Any:
    text = req.data["text"]
    sentiment_analyzer = SentimentIntensityAnalyzer()
    scores = sentiment_analyzer.polarity_scores(text)
    print(scores)

    print(req.data["text"])
    return scores
