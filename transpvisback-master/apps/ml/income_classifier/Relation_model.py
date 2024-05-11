import pandas as pd
import numpy as np
import os
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, LSTM, Dense, Dropout, Bidirectional
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint
from tensorflow.keras.models import load_model
tokenizer = Tokenizer()


class relation_model:
  def __init__(self):
    CURRENT_DIR = os.path.dirname(__file__)
    self.model = load_model(CURRENT_DIR + '/relation_model/relation_extraction_model.h5', compile=False)
    # Load the Tokenizer and LabelEncoders
    self.tokenizer_word_index = np.load(CURRENT_DIR + '/relation_model/tokenizer_word_index.npy', allow_pickle=True).item()
    self.label_encoders = np.load(CURRENT_DIR + '/relation_model/label_encoders.npy', allow_pickle=True).item()

  # Function to preprocess new pairs of stakeholder and information elements
  def preprocess_new_pairs(self, stakeholders, info_elements):
      X_text = stakeholders.astype(str) + " " + info_elements.astype(str)
      return X_text

  # Function to tokenize and pad sequences
  def tokenize_and_pad_sequences(self, text_data, tokenizer, max_length):
      X = tokenizer.texts_to_sequences(text_data)
      X = pad_sequences(X, maxlen=max_length)
      return X

  # Function to predict relation type between new pairs
  def predict_relation_type(self,stakeholders, info_elements, max_length):
      # Preprocess new pairs
      X_text = self.preprocess_new_pairs(stakeholders, info_elements)

      # Tokenize and pad sequences
      X = self.tokenize_and_pad_sequences(X_text, tokenizer, max_length)

      # Make predictions
      Y_pred = self.model.predict(X)

      # Convert predicted labels to original classes
      Y_pred_labels = np.argmax(Y_pred, axis=1)
      Y_pred_labels = self.label_encoders["relation type"].inverse_transform(Y_pred_labels)

      return Y_pred_labels