import json
from rest_framework import views, status
from rest_framework.response import Response
from transpvisback.wsgi import registry

from rest_framework import viewsets
from rest_framework import mixins

from apps.endpoints.models import Endpoint
from apps.endpoints.serializers import EndpointSerializer

from apps.endpoints.models import MLAlgorithm
from apps.endpoints.serializers import MLAlgorithmSerializer

from apps.endpoints.models import MLAlgorithmStatus
from apps.endpoints.serializers import MLAlgorithmStatusSerializer

from apps.endpoints.models import MLRequest
from apps.endpoints.serializers import MLRequestSerializer
import pandas as pd
class EndpointViewSet(
    mixins.RetrieveModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet
):
    serializer_class = EndpointSerializer
    queryset = Endpoint.objects.all()


class MLAlgorithmViewSet(
    mixins.RetrieveModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet
):
    serializer_class = MLAlgorithmSerializer
    queryset = MLAlgorithm.objects.all()


def deactivate_other_statuses(instance):
    old_statuses = MLAlgorithmStatus.objects.filter(parent_mlalgorithm = instance.parent_mlalgorithm,
                                                        created_at__lt=instance.created_at,
                                                        active=True)
    for i in range(len(old_statuses)):
        old_statuses[i].active = False
    MLAlgorithmStatus.objects.bulk_update(old_statuses, ["active"])

class MLAlgorithmStatusViewSet(
    mixins.RetrieveModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet,
    mixins.CreateModelMixin
):
    serializer_class = MLAlgorithmStatusSerializer
    queryset = MLAlgorithmStatus.objects.all()
    def perform_create(self, serializer):
        try:
            with transaction.atomic():
                instance = serializer.save(active=True)
                # set active=False for other statuses
                deactivate_other_statuses(instance)



        except Exception as e:
            raise APIException(str(e))

class MLRequestViewSet(
    mixins.RetrieveModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet,
    mixins.UpdateModelMixin
):
    serializer_class = MLRequestSerializer
    queryset = MLRequest.objects.all()


class getAlgoView(views.APIView):
    def post(self, endpoint_name):
        algs = MLAlgorithm.objects.filter(name = endpoint_name,status__active=True)
        alg_index = 1
        return algs


class PredictView(views.APIView):
    def post(self, request, endpoint_name, format=None):
    
        algs = MLAlgorithm.objects.filter(parent_endpoint__name = endpoint_name)
        if len(algs) == 0:
            return Response(
                {"status": "Error", "message": "ML algorithm is not available"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        alg_index = 0
        
        print("registry.endpoints ========= ", registry.endpoints)
        print("registry.endpoints ========= ", registry.endpoints)
        algorithm_object = registry.endpoints[1]
        prediction = algorithm_object.compute_prediction(request.data)

        label = prediction["label"] if "label" in prediction else "error"
        ml_request = MLRequest(
            input_data=json.dumps(request.data),
            full_response=prediction,
            response=label,
            feedback="",
            parent_mlalgorithm=algs[alg_index],
        )
        ml_request.save()

        prediction["request_id"] = ml_request.id
        prediction["data"] = request.data

        return Response(prediction)

class PredictLSTMView(views.APIView):

    def post(self, request, endpoint_name, format=None):

        algs = MLAlgorithm.objects.filter(parent_endpoint__name = endpoint_name)
        if len(algs) == 0:
            return Response(
                {"status": "Error", "message": "ML algorithm is not available"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        alg_index = 1
        algorithm_object = registry.endpoints[2]
        print("algorithme object = ", algorithm_object)
        prediction = algorithm_object.compute_prediction(request.data)
        summary = prediction["summary"] if "summary" in prediction else "error"
        ml_request = MLRequest(
            input_data=json.dumps(request.data),
            full_response=prediction,
            response=summary,
            feedback="",
            parent_mlalgorithm=algs[alg_index],
        )
        ml_request.save()
        prediction["request_id"] = ml_request.id
        prediction["data"] = request.data

        return Response(prediction)

class PredictClassView(views.APIView):
    def post(self, request, endpoint_name, format=None):

        algs = MLAlgorithm.objects.filter(parent_endpoint__name = endpoint_name)
        if len(algs) == 0:
            return Response(
                {"status": "Error", "message": "ML algorithm is not available"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        alg_index = 0
        algorithm_object = registry.endpoints[3]
        prediction = algorithm_object.compute_prediction(request.data)

        label = prediction["label"] if "label" in prediction else "error"
        ml_request = MLRequest(
            input_data=json.dumps(request.data),
            full_response=prediction,
            response=label,
            feedback="",
            parent_mlalgorithm=algs[alg_index],
        )
        ml_request.save()

        prediction["request_id"] = ml_request.id
        prediction["data"] = request.data

        return Response(prediction)

class PredictionFunctionView(views.APIView):
    def post(self, request, endpoint_name, format=None):

        algs = MLAlgorithm.objects.filter(parent_endpoint__name = endpoint_name)
        if len(algs) == 0:
            return Response(
                {"status": "Error", "message": "ML algorithm is not available"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        alg_index = 0
        algorithm_object = registry.endpoints[4]
        data = request.data["paragraph"]
        print (data)
        prediction = algorithm_object.mlmodel(data)

        label = prediction["label"] if "label" in prediction else "error"
        ml_request = MLRequest(
            input_data=json.dumps(request.data),
            full_response=prediction,
            response=label,
            feedback="",
            parent_mlalgorithm=algs[alg_index],
        )
        ml_request.save()

        prediction["request_id"] = ml_request.id
        return Response(prediction)


class paragraphs(views.APIView):
    def post (self, request, endpoint_name, format=None):
        data = request.data["paragraph"]
        data= data.split("\n")
        print("Number of paragraphs is : ", len(data))
        table = []
        for index, p in enumerate(data): 
            if data[index] == "":
                del data[index]
            else: 
                table.append(data[index])
            
        print("Number of paragraphs is : ", len(data))
        return Response(table)

class PredictionFunctionViewFull(views.APIView):
    def post(self, request, endpoint_name, format=None):

        algs = MLAlgorithm.objects.filter(parent_endpoint__name = endpoint_name)
        if len(algs) == 0:
            return Response(
                {"status": "Error", "message": "ML algorithm is not available"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        alg_index = 0
        algorithm_object = registry.endpoints[4]
        data = request.data
        print("data = ",data)
        if isinstance(data, str):
            data = data.split("\n")
        else:
            print("Data is not a string, cannot split.")
        table = []
        for index, p in enumerate(data): 
            if data[index] != "":
                table.append(data[index])
        predictionResults = []
        summaries = []
        cpt = 0
        for x in table:
            print ("xxxxxx = ",x)
            prediction = algorithm_object.mlmodel(x)
            print("prediction ==========",prediction)

            label = prediction["label"] if "label" in prediction else "error"
            ml_request = MLRequest(
                input_data=json.dumps(x),
                full_response=prediction,
                response=label,
                feedback="",
                parent_mlalgorithm=algs[alg_index],
            )
            ml_request.save()
            prediction["request_id"] = ml_request.id
            if cpt != 0:
                if (prediction["summary"] not in summaries):
                    predictionResults.append(prediction)
                else :
                    print("prediction already exists !!")
            else:
                predictionResults.append(prediction)

                
                print("prediction results ==========",predictionResults)
                summaries.append(prediction["summary"]) 
            cpt = cpt+1
       

        return Response(predictionResults)

class PredictSummaryView(views.APIView):
    def post(self, request, endpoint_name, format=None):

        algs = MLAlgorithm.objects.filter(parent_endpoint__name = endpoint_name)
        if len(algs) == 0:
            return Response(
                {"status": "Error", "message": "ML algorithm is not available"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        alg_index = 0
        algorithm_object = registry.endpoints[5]
        data = request.data["paragraph"]
        if len(data.split()) < 10:
            prediction = "paragraphe too short !!"
        else: 
            prediction = algorithm_object.compute_prediction(request.data)
            summary = prediction["summary"] if "summary" in prediction else "error"
            ml_request = MLRequest(
                input_data=json.dumps(request.data),
                full_response=prediction,
                response=summary,
                feedback="",
                parent_mlalgorithm=algs[alg_index],
            )
            ml_request.save()
            prediction["label"] = "data"
            prediction["request_id"] = ml_request.id

        return Response(prediction)


class PredictionViewHuggingFaceFull(views.APIView):
    def post(self, request, endpoint_name, format=None):

        algs = MLAlgorithm.objects.filter(parent_endpoint__name = endpoint_name)
        if len(algs) == 0:
            return Response(
                {"status": "Error", "message": "ML algorithm is not available"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        alg_index = 0
        algorithm_object = registry.endpoints[6]
        data = request.data
        data = data.split("\n")
        table = []
        for index, p in enumerate(data):
            print("data[index] ============ ", data[index])
            if data[index] == "" or len(data[index].split()) < 10:
                del data[index]
            else: 
                table.append(data[index])
        predictionResults = []
        summaries = []
        cpt = 0
        for x in table:
            prediction = algorithm_object.mlmodel(x)
            label = prediction["label"] if "label" in prediction else "error"
            ml_request = MLRequest(
                input_data=json.dumps(x),
                full_response=prediction,
                response=label,
                feedback="",
                parent_mlalgorithm=algs[alg_index],
            )
            ml_request.save()
            prediction["request_id"] = ml_request.id
            if cpt != 0:
                if (prediction["summary"] not in summaries):
                    predictionResults.append(prediction)
                else :
                    print("prediction already exixts !!")
            else:
                predictionResults.append(prediction)
                summaries.append(prediction["summary"])
            cpt = cpt+1

        print(predictionResults)
        return Response(predictionResults)

       
class NER_Prediction(views.APIView):
    def post(self, request, endpoint_name, format=None):

        algs = MLAlgorithm.objects.filter(parent_endpoint__name = endpoint_name)
        if len(algs) == 0:
            return Response(
                {"status": "Error", "message": "ML algorithm is not available"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        alg_index = 0
        algorithm_object = registry.endpoints[7]
        data = request.data['transparencyNote']
        print("data = ",data)
        if isinstance(data, str):
            data = data.replace('\n', ' ').replace('\r', '')
        else:
            print("Data is not a string, cannot split.")
        table = []
        for index, p in enumerate(data): 
            if data[index] == "":
                del data[index]
            else: 
                table.append(data[index])
        predictionResults = []
        entities = []
        cpt = 0
        #for x in table:
        print ("xxxxxx = ",data)
        prediction = algorithm_object.mlmodel(data)
        print("prediction ==========",prediction)

        label = prediction["label"] if "label" in prediction else "error"
        ml_request = MLRequest(
            input_data=json.dumps(data),
            full_response=prediction,
            response=label,
            feedback="",
            parent_mlalgorithm=algs[alg_index],
        )
        ml_request.save()
        prediction["request_id"] = ml_request.id
        if "entities" in prediction:
            for entity in prediction["entities"]:
                if cpt != 0: 
                    if entity["entity"] not in entities:
                        predictionResults.append(entity)
                    else :
                        print("prediction already exists !!")
                else:
                    print("prediction results ==========",predictionResults)
                    predictionResults.append(entity)
                    entities.append(entity["entity"]) 
        cpt = cpt+1
        #predictionResults.append({'entity': 'company', 'label': 'ENTITY'})
        #predictionResults.append({'entity': 'customer', 'label': 'ENTITY'})
       

        return Response(predictionResults)

class T_NER_Prediction(views.APIView):
    def post(self, request, endpoint_name, format=None):

        algs = MLAlgorithm.objects.filter(parent_endpoint__name = endpoint_name)
        if len(algs) == 0:
            return Response(
                {"status": "Error", "message": "ML algorithm is not available"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        alg_index = 0
        algorithm_object = registry.endpoints[8]
        data = request.data['transparencyNote']
        print("data = ",data)
        if isinstance(data, str):
            data = data.replace('\n', ' ').replace('\r', '')
        else:
            print("Data is not a string, cannot split.")
        table = []
        for index, p in enumerate(data): 
            if data[index] == "":
                del data[index]
            else: 
                table.append(data[index])
        predictionResults = []
        entities = []
        cpt = 0
        
        print ("xxxxxx = ",data)
        prediction = algorithm_object.mlmodel(data)
        print("prediction ==========",prediction)

        label = prediction["label"] if "label" in prediction else "error"
        ml_request = MLRequest(
            input_data=json.dumps(data),
            full_response=prediction,
            response=label,
            feedback="",
            parent_mlalgorithm=algs[alg_index],
        )
        ml_request.save()
        prediction["request_id"] = ml_request.id
        if "entities" in prediction:
            for entity in prediction["entities"]:
                if cpt != 0: 
                    if entity["entity"] not in entities:
                        predictionResults.append(entity)
                    else :
                        print("prediction already exists !!")
                else:
                    print("prediction results ==========",predictionResults)
                    predictionResults.append(entity)
                    entities.append(entity["entity"]) 
        cpt = cpt+1
        #predictionResults.append({'entity': 'company', 'label': 'ENTITY'})
        #predictionResults.append({'entity': 'customer', 'label': 'ENTITY'})
       

        return Response(predictionResults)


class X_NER_Prediction(views.APIView):
    def post(self, request, endpoint_name, format=None):

        algs = MLAlgorithm.objects.filter(parent_endpoint__name = endpoint_name)
        if len(algs) == 0:
            return Response(
                {"status": "Error", "message": "ML algorithm is not available"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        alg_index = 0
        algorithm_object = registry.endpoints[9]
        data = request.data['transparencyNote']
        print("data = ",data)
        if isinstance(data, str):
            data = data.replace('\n', ' ').replace('\r', '')
        else:
            print("Data is not a string, cannot split.")
        table = []
        for index, p in enumerate(data): 
            if data[index] == "":
                del data[index]
            else: 
                table.append(data[index])
        predictionResults = []
        entities = []
        cpt = 0
        print ("xxxxxx = ",data)
        prediction = algorithm_object.mlmodel(data)
        print("prediction ==========",prediction)

        label = prediction["label"] if "label" in prediction else "error"
        ml_request = MLRequest(
            input_data=json.dumps(data),
            full_response=prediction,
            response=label,
            feedback="",
            parent_mlalgorithm=algs[alg_index],
        )
        ml_request.save()
        prediction["request_id"] = ml_request.id
        if "entities" in prediction:
            for entity in prediction["entities"]:
                if cpt != 0: 
                    if entity["entity"] not in entities:
                        predictionResults.append(entity)
                    else :
                        print("prediction already exists !!")
                else:
                    print("prediction results ==========",predictionResults)
                    predictionResults.append(entity)
                    entities.append(entity["entity"]) 
        cpt = cpt+1
        #predictionResults.append({'entity': 'company', 'label': 'ENTITY'})
        #predictionResults.append({'entity': 'customer', 'label': 'ENTITY'})
       

        return Response(predictionResults)


class B_NER_Prediction(views.APIView):
    def post(self, request, endpoint_name, format=None):

        algs = MLAlgorithm.objects.filter(parent_endpoint__name = endpoint_name)
        if len(algs) == 0:
            return Response(
                {"status": "Error", "message": "ML algorithm is not available"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        alg_index = 0
        algorithm_object = registry.endpoints[10]
        data = request.data['transparencyNote']
        print("data = ",data)
        if isinstance(data, str):
            data = data.replace('\n', ' ').replace('\r', '')
        else:
            print("Data is not a string, cannot split.")
        table = []
        for index, p in enumerate(data): 
            if data[index] == "":
                del data[index]
            else: 
                table.append(data[index])
        predictionResults = []
        entities = []
        cpt = 0
        
        print ("xxxxxx = ",data)
        prediction = algorithm_object.mlmodel(data)
        print("prediction ==========",prediction)

        label = prediction["label"] if "label" in prediction else "error"
        ml_request = MLRequest(
            input_data=json.dumps(data),
            full_response=prediction,
            response=label,
            feedback="",
            parent_mlalgorithm=algs[alg_index],
        )
        ml_request.save()
        prediction["request_id"] = ml_request.id
        if "entities" in prediction:
            for entity in prediction["entities"]:
                if cpt != 0: 
                    if entity["entity"] not in entities:
                        predictionResults.append(entity)
                    else :
                        print("prediction already exists !!")
                else:
                    print("prediction results ==========",predictionResults)
                    predictionResults.append(entity)
                    entities.append(entity["entity"]) 
        cpt = cpt+1
        #predictionResults.append({'entity': 'company', 'label': 'ENTITY'})
        #predictionResults.append({'entity': 'customer', 'label': 'ENTITY'})
       

        return Response(predictionResults)


class Relation_Prediction(views.APIView):
    def post(self, request, endpoint_name, format=None):

        algs = MLAlgorithm.objects.filter(parent_endpoint__name = endpoint_name)
        if len(algs) == 0:
            return Response(
                {"status": "Error", "message": "ML algorithm is not available"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        # Create an instance of the relation_model
        algorithm_object = registry.endpoints[11]
        alg_index = 0
        # Define max_length
        max_length = 2  # You can adjust this value as needed
        stakeholders = pd.Series(request.data['stakeholder'])
        information_elements = pd.Series(request.data['ie'])
        print("data1********", stakeholders)
        print("data1********", information_elements)
       
        # Initialize the list to store prediction results
        predictionResults = []
        label = "relation"

        # Iterate through each pair of stakeholders and information elements
        for stakeholder, info_element in zip(stakeholders, information_elements):
            # Predict the relation type
            predicted_relation = algorithm_object.predict_relation_type(pd.Series([stakeholder]), pd.Series([info_element]), max_length)

            # Append the predicted relation to the results list
            predictionResults.append({
                "stakeholder": stakeholder,
                "information_element": info_element,
                "predicted_relation": predicted_relation[0]  # Assuming the predict_relation_type method returns a single prediction
            })
        ml_request = MLRequest(
            input_data=json.dumps(request.data),
            full_response=predictionResults,
            response=label,
            feedback="",
            parent_mlalgorithm=algs[alg_index],
        )
        ml_request.save()

        return Response(predictionResults)


class binary_Relation_Prediction(views.APIView):
    def post(self, request, endpoint_name, format=None):

        algs = MLAlgorithm.objects.filter(parent_endpoint__name = endpoint_name)
        if len(algs) == 0:
            return Response(
                {"status": "Error", "message": "ML algorithm is not available"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        # Create an instance of the relation_model
        algorithm_object = registry.endpoints[12]

        alg_index = 0
        stakeholders = request.data['stakeholder']
        information_elements = request.data['ie']

        print("data = ",stakeholders)
        print("data2 = ",information_elements)
        # Initialize the list to store prediction results
        predictionResults = []
        label = "relation"

        
        # Predict the relation type
        predicted_relation = algorithm_object.mlmodel(stakeholders, information_elements)

        # Append the predicted relation to the results list
        predictionResults.append({
            "stakeholder": stakeholders,
            "information_element": information_elements,
            "predicted_relation": predicted_relation  
        })
        
        ml_request = MLRequest(
            input_data=json.dumps(request.data),
            full_response=predictionResults,
            response=label,
            feedback="",
            parent_mlalgorithm=algs[alg_index],
        )
        ml_request.save()

        return Response(predictionResults)
