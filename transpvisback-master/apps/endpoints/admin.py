from django.contrib import admin


from apps.endpoints.models import (
    Endpoint,
    MLAlgorithm,
    MLAlgorithmStatus,
    MLRequest
)


admin.site.register(
    [
        Endpoint,
        MLAlgorithm,
        MLAlgorithmStatus,
        MLRequest
    ]
)
