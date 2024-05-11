import pickle
import os
import requests

API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn"
headers = {"Authorization": "Bearer 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"}

class huggingFace:
    # the constructor which loads preprocessing objects and Naive Bayes object (created with Jupyter notebook)
    def __init__(self): 
        CURRENT_DIR = os.path.dirname(__file__)
        print("CURRENT_DIR = ", CURRENT_DIR)
        # self.model = pickle.load(open(CURRENT_DIR + "/HuggingFace/summarizer.pkl", "rb"))

    def query(self, payload):
            response = requests.post(API_URL, headers=headers, json=payload)
            return response.json()

    # the method applies pre-processing
    def preprocessing(self, input_data):
        data = input_data["paragraph"]
        return data

    # the method that calls ML for computing predictions on prepared data
    def predict(self, input_data):
        data = {
            "inputs": input_data,
            "parameters": {"max_length":20, "min_length":2, "do_sample": False},
        }
        prediction = self.query( data )
        return (prediction)

    # the method that applies post-processing on prediction values
    def postprocessing(self, input_data):
        return {"summary": input_data, "status": "OK"}

    # the method that combines: preprocessing, predict and postprocessing and returns JSON object with the response
    def compute_prediction(self, input_data):
        try:
            input = self.preprocessing(input_data)
            prediction = self.predict(input)
            prediction = self.postprocessing(prediction)
        except Exception as e:
            return {"status": "Error", "message": str(e)}
        return prediction