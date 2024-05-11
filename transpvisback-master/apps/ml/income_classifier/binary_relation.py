import pandas as pd
import numpy as np
import os
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline
from imblearn.under_sampling import RandomUnderSampler
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
import joblib



class binary_relation_model:
  def __init__(self):
    CURRENT_DIR = os.path.dirname(__file__)
    # Load the saved pipeline
    self.pipeline_loaded = joblib.load(CURRENT_DIR + '/binary_relation_model/relation_model.joblib')

  def mlmodel(self, information_elements, stakeholders):
          try:
              
              # Concatenate stakeholder and information_element into a single string
              text = information_elements + ' ' + stakeholders

              # Make predictions on the concatenated text
              predictions = self.pipeline_loaded.predict([text])
              # Make predictions on new pairs
              #predictions = self.pipeline_loaded.predict(new_pairs['information element'] + ' ' + new_pairs['stakholder']
             
              return predictions[0]
          except Exception as e:
              return {"status": "Error", "message": str(e)}
          