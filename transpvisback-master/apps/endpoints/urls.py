from django.conf.urls import url, include
from django.urls import path
from rest_framework.routers import DefaultRouter

from apps.endpoints.views import EndpointViewSet
from apps.endpoints.views import MLAlgorithmViewSet
from apps.endpoints.views import MLAlgorithmStatusViewSet
from apps.endpoints.views import MLRequestViewSet
'''
from apps.endpoints.views import PredictView
from apps.endpoints.views import getAlgoView
from apps.endpoints.views import PredictLSTMView
from apps.endpoints.views import PredictClassView
from apps.endpoints.views import PredictionFunctionView
from apps.endpoints.views import PredictionFunctionViewFull
from apps.endpoints.views import paragraphs
from apps.endpoints.views import PredictSummaryView
from apps.endpoints.views import PredictionViewHuggingFaceFull
'''
router = DefaultRouter(trailing_slash=False)
router.register(r"endpoints", EndpointViewSet, basename="endpoints")
router.register(r"mlalgorithms", MLAlgorithmViewSet, basename="mlalgorithms")
router.register(r"mlalgorithmstatuses", MLAlgorithmStatusViewSet, basename="mlalgorithmstatuses")
router.register(r"mlrequests", MLRequestViewSet, basename="mlrequests")
'''
urlpatterns = [
    url(r"^v2/", include(router.urls)),
    url(r"^v2/(?P<endpoint_name>.+)/predict$", PredictView.as_view(), name="predict"),
    url(r"^v2/(?P<endpoint_name>.+)/getalgo$", getAlgoView.as_view(), name="predict"),
    url(r"^v2/(?P<endpoint_name>.+)/predictLSTM$", PredictLSTMView.as_view(), name="predict"),
    url(r"^v2/(?P<endpoint_name>.+)/predictClass$", PredictClassView.as_view(), name="predict"),
    url(r"^v2/(?P<endpoint_name>.+)/predictModel$", PredictionFunctionView.as_view(), name="predict"),
    url(r"^v2/(?P<endpoint_name>.+)/paragraphs$", paragraphs.as_view(), name="predict"),    
    url(r"^v2/(?P<endpoint_name>.+)/predictModelFull$", PredictionFunctionViewFull.as_view(), name="predict"),
    url(r"^v2/(?P<endpoint_name>.+)/predictHuggingFace$", PredictSummaryView.as_view(), name="predict"),
    url(r"^v2/(?P<endpoint_name>.+)/predictHuggingFaceModel$", PredictionViewHuggingFaceFull.as_view(), name="predict"),
]
'''

from django.urls import path
from .views import (
    PredictView,
    getAlgoView,
    PredictLSTMView,
    PredictClassView,
    PredictionFunctionView,
    paragraphs,
    PredictionFunctionViewFull,
    PredictSummaryView,
    PredictionViewHuggingFaceFull,
    NER_Prediction,
    T_NER_Prediction,
    X_NER_Prediction,
    B_NER_Prediction,
    Relation_Prediction,
    binary_Relation_Prediction,
)

urlpatterns = [
    path("", include(router.urls)),
    path("<str:endpoint_name>/predict/", PredictView.as_view(), name="predict"),
    path("<str:endpoint_name>/getalgo/", getAlgoView.as_view(), name="predict"),
    path("<str:endpoint_name>/predictLSTM/", PredictLSTMView.as_view(), name="predict"),
    path("<str:endpoint_name>/predictClass/", PredictClassView.as_view(), name="predict"),
    path("<str:endpoint_name>/predictModel/", PredictionFunctionView.as_view(), name="predict"),
    path("<str:endpoint_name>/paragraphs/", paragraphs.as_view(), name="predict"),    
    path("<str:endpoint_name>/predictModelFull/", PredictionFunctionViewFull.as_view(), name="predict"),
    path("<str:endpoint_name>/predictHuggingFace/", PredictSummaryView.as_view(), name="predict"),
    path("<str:endpoint_name>/predictHuggingFaceModel/", PredictionViewHuggingFaceFull.as_view(), name="predict"),
    path("<str:endpoint_name>/ner_extraction/", NER_Prediction.as_view(), name="predict"),
    path("<str:endpoint_name>/t_ner_extraction/", T_NER_Prediction.as_view(), name="predict"),
    path("<str:endpoint_name>/x_ner_extraction/", X_NER_Prediction.as_view(), name="predict"),
    path("<str:endpoint_name>/b_ner_extraction/", B_NER_Prediction.as_view(), name="predict"),
    path("<str:endpoint_name>/relation_extraction/", Relation_Prediction.as_view(), name="predict"),
    path("<str:endpoint_name>/binary_relation_extraction/", binary_Relation_Prediction.as_view(), name="predict"),
]
 