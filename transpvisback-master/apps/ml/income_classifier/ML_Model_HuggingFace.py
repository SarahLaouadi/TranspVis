import pickle
import os
import requests
from scipy.sparse import csr_matrix

API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn"
headers = {"Authorization": "Bearer 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"}


class MLModelHF:

    def __init__(self): 
        CURRENT_DIR = os.path.dirname(__file__)
        self.model_classifier1 = pickle.load(open(CURRENT_DIR + "/classifier1/naive_bayes.pkl", "rb"))
        self.vectorizer_from_train_data_classifier1 = pickle.load(open(CURRENT_DIR + "/classifier1/count_vectorizer.pkl", "rb"))
        self.model_classifier2 = pickle.load(open(CURRENT_DIR + "/classifier2/naive_bayes_2.pkl", "rb"))
        self.vectorizer_from_train_data_classifier2 = pickle.load(open(CURRENT_DIR + "/classifier2/count_vectorizer_2.pkl", "rb"))

    def query(self, payload):
        response = requests.post(API_URL, headers=headers, json=payload)
        return response.json()

    # the method applies pre-processing
    def preprocessing_classifier1(self, input_data):
        data = self.vectorizer_from_train_data_classifier1.transform([input_data])
        return csr_matrix.toarray(data)

    # the method that calls ML for computing predictions on prepared data
    def predict_classifier1(self, input_data):
        return self.model_classifier1.predict_proba(input_data)

    # the method that applies post-processing on prediction values
    def postprocessing_classifier1(self, input_data):
        label = "false"
        if input_data[1] > 0.5:
            label = "true"
        return {"proba": label, "label": input_data, "status": "OK"}

    # the method that combines: preprocessing, predict and postprocessing and returns JSON object with the response
    def compute_prediction_classifier1(self, input_data):
        try:
            input = self.preprocessing_classifier1(input_data)
            prediction = self.predict_classifier1(input)[0]
            prediction = self.postprocessing_classifier1(prediction)
        except Exception as e:
            return {"status": "Error", "message": str(e)}
        return prediction

    # the method applies pre-processing
    def preprocessing_huggingFace(self, input_data):
        # data = input_data["paragraph"]
        return input_data

    # the method that calls ML for computing predictions on prepared data
    def predict_huggingFace(self, input_data):
        data = {
            "inputs": input_data,
            "parameters": {"max_length":20, "min_length":2, "do_sample": False},
        }
        prediction = self.query (data)
        return (prediction)
        # return self.model(input_data, max_length=20, min_length=2, do_sample=False)

    # the method that applies post-processing on prediction values
    def postprocessing_huggingface(self, input_data):
        return {"summary": input_data, "status": "OK"}

    # the method that combines: preprocessing, predict and postprocessing and returns JSON object with the response
    def compute_prediction_huggingFace(self, input_data):
        try:
            input = self.preprocessing_huggingFace(input_data)
            prediction = self.predict_huggingFace(input)
            prediction = self.postprocessing_huggingface(prediction)
        except Exception as e:
            return {"status": "Error", "message": str(e)}
        return prediction
    
    # the method applies pre-processing
    def preprocessing_classifier2(self, input_data):
        data = self.vectorizer_from_train_data_classifier2.transform([input_data])
        return csr_matrix.toarray(data)

    # the method that calls ML for computing predictions on prepared data
    def predict_classifier2(self, input_data):
        return self.model_classifier2.predict(input_data)

    # the method that applies post-processing on prediction values
    def postprocessing_classifier2(self, input_data):
        return {"label": input_data, "status": "OK"}

    # the method that combines: preprocessing, predict and postprocessing and returns JSON object with the response
    def compute_prediction_classifier2(self, input_data):
        try:
            input = self.preprocessing_classifier2(input_data)
            prediction = self.predict_classifier2(input)[0]
            prediction = self.postprocessing_classifier2(prediction)
        except Exception as e:
            return {"status": "Error", "message": str(e)}
        return prediction

    def mlmodel(self, input_data):
        try:
            prediction = self.compute_prediction_classifier1(input_data)
            if (prediction['proba'] =='true'):
                text = self.compute_prediction_huggingFace(input_data)
                summary = text['summary']
                sum = summary[0]['summary_text']
                classification = self.compute_prediction_classifier2(sum)
                return {"paragraph":input_data,"summary": sum, "label": classification['label'], "status": "OK"}
        except Exception as e:
            return {"status": "Error", "message": str(e)}