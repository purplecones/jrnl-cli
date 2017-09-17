import sentiment from 'sentiment';

export const getSentimentScore = text => sentiment(text);
