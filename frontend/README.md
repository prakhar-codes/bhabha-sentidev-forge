Prakhar-EP22BTECH11021 Anirudh-MA22BTECH11005 Pranay-AI22BTECH11020 Shriram-ME22BTECH11023 Saksham-AI22BTECH11024

An interactive website ranking the 10 most visited place in Hyderabad based on reviews

An interactive website with 10 most visited places in Hyderabad. Upon clicking any of the place we get a set of reviews along with the predicted rating by the model for the given reviews and we also have the actual given rating by the users in each review. We have also given emoji to each rating and also given each place the best partner to visit with(friends, family, girlfriend).

Model is trained on data scraped from online websites like tripadvisor and was tested on google form data given by the students. We used distilbert (pre trained model) and fine tuned on our dataset. We predicted the rating 1-5 from the given review by the help of model. We also did used spacy for finding out most common adjectives and named entitiies, and used nltk for most common bigrams and trigrams.
