"""
WSGI config for transpvisback project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'transpvisback.settings')
application = get_wsgi_application()
# ML registry
import inspect
from apps.ml.registry import MLRegistry
from apps.ml.income_classifier.naiveBayes import NaiveBayesClassifier
from apps.ml.income_classifier.textGenerator import TextGenerator
from apps.ml.income_classifier.classifier2 import Classifier2
from apps.ml.income_classifier.ML_Model import MLModel
from apps.ml.income_classifier.huggingFace import huggingFace
from apps.ml.income_classifier.ML_Model_HuggingFace import MLModelHF
from apps.ml.income_classifier.NER_Model import ner_model
from apps.ml.income_classifier.Tner_model import Tner_model
from apps.ml.income_classifier.XLNET_ML_Model import Xner_model
from apps.ml.income_classifier.BERT_ML_Model import Bner_model
from apps.ml.income_classifier.Relation_model import relation_model
from apps.ml.income_classifier.binary_relation import binary_relation_model


try:
    registry = MLRegistry() # create ML registry
    # Naive Bayes Classifier
    nv = NaiveBayesClassifier()
    print("registery 1", nv)
    registry.add_algorithm(endpoint_name="income_classifier",
                            algorithm_object=nv,
                            algorithm_name="Naive Bayes",
                            algorithm_status="production",
                            algorithm_version="0.0.1",
                            owner="khadidja",
                            algorithm_description="Naive Bayes with simple pre- and post-processing",
                            algorithm_code=inspect.getsource(NaiveBayesClassifier))

    lstm = TextGenerator()
    print("registery 2", lstm)
    registry.add_algorithm(endpoint_name="income_classifier",
                            algorithm_object=lstm,
                            algorithm_name="LSTM",
                            algorithm_status="production",
                            algorithm_version="0.0.1",
                            owner="khadidja",
                            algorithm_description="LSTM - Long Short Memory",
                            algorithm_code=inspect.getsource(TextGenerator))

    nv2 = Classifier2()
    print("registery 3", nv2)
    registry.add_algorithm(endpoint_name="income_classifier",
                            algorithm_object=nv2,
                            algorithm_name="Naive Bayes",
                            algorithm_status="production",
                            algorithm_version="0.0.1",
                            owner="khadidja",
                            algorithm_description="Naive Bayes",
                            algorithm_code=inspect.getsource(Classifier2))

    ml = MLModel()
    print("registery 4", ml)
    registry.add_algorithm(endpoint_name="income_classifier",
                            algorithm_object=ml,
                            algorithm_name="full classification model",
                            algorithm_status="production",
                            algorithm_version="0.0.1",
                            owner="khadidja",
                            algorithm_description="Information Elements classification",
                            algorithm_code=inspect.getsource(MLModel))

    hf = huggingFace()
    print("registery 5", hf)
    registry.add_algorithm(endpoint_name="income_classifier",
                            algorithm_object=hf,
                            algorithm_name="Hugging face Transformer alone",
                            algorithm_status="production",
                            algorithm_version="0.0.1",
                            owner="khadidja",
                            algorithm_description="Hugging Face CNN",
                            algorithm_code=inspect.getsource(huggingFace))

    hfm = MLModelHF()
    print("registery 6", hfm)
    registry.add_algorithm(endpoint_name="income_classifier",
                            algorithm_object=hfm,
                            algorithm_name="Hugging face full Model",
                            algorithm_status="production",
                            algorithm_version="0.0.1",
                            owner="khadidja",
                            algorithm_description="Hugging CNN Model with classification",
                            algorithm_code=inspect.getsource(MLModelHF))
    ner = ner_model()
    print("registery 7", ner)
    registry.add_algorithm(endpoint_name="income_classifier",
                            algorithm_object=ner,
                            algorithm_name="Spacy Named Entity Recognition Model",
                            algorithm_status="production",
                            algorithm_version="0.0.1",
                            owner="Sara LAOUADI",
                            algorithm_description="Extract named entities from unstructured text using Spacy-Transformers",
                            algorithm_code=inspect.getsource(ner_model))
    Tner = Tner_model()
    print("registery 8", Tner)
    registry.add_algorithm(endpoint_name="income_classifier",
                            algorithm_object=Tner,
                            algorithm_name="Transformers Named Entity Recognition Model",
                            algorithm_status="production",
                            algorithm_version="0.0.1",
                            owner="Sara LAOUADI",
                            algorithm_description="Extract named entities from unstructured text using Transformers",
                            algorithm_code=inspect.getsource(Tner_model))
    Xner = Xner_model()
    print("registery 9", Xner)
    registry.add_algorithm(endpoint_name="income_classifier",
                            algorithm_object=Xner,
                            algorithm_name="XLNET Named Entity Recognition Model",
                            algorithm_status="production",
                            algorithm_version="0.0.1",
                            owner="Sara LAOUADI",
                            algorithm_description="Extract named entities from unstructured text using XLNET",
                            algorithm_code=inspect.getsource(Xner_model))
    Bner = Bner_model()
    print("registery 10", Bner)
    registry.add_algorithm(endpoint_name="income_classifier",
                            algorithm_object=Bner,
                            algorithm_name="BERT Named Entity Recognition Model",
                            algorithm_status="production",
                            algorithm_version="0.0.1",
                            owner="Sara LAOUADI",
                            algorithm_description="Extract named entities from unstructured text using BERT",
                            algorithm_code=inspect.getsource(Bner_model))
    relation = relation_model()
    print("registery 11", relation)
    registry.add_algorithm(endpoint_name="income_classifier",
                            algorithm_object=relation,
                            algorithm_name="BiLSTM relation prediction model",
                            algorithm_status="production",
                            algorithm_version="0.0.1",
                            owner="Sara LAOUADI",
                            algorithm_description="predict the relation type between stakeholders and information elements",
                            algorithm_code=inspect.getsource(relation_model))
    binary_relation = binary_relation_model()
    print("registery 12", binary_relation)
    registry.add_algorithm(endpoint_name="income_classifier",
                            algorithm_object=binary_relation,
                            algorithm_name="Logistic Regression model with TF-IDF Vectorization ",
                            algorithm_status="production",
                            algorithm_version="0.0.1",
                            owner="Sara LAOUADI",
                            algorithm_description="predict a relation exist between stakeholders and information elements",
                            algorithm_code=inspect.getsource(binary_relation_model))
except Exception as e:
    print("Exception while while loading the algorithms to the registry,", str(e))
