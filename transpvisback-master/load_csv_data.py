import csv
from datetime import datetime

import os
import django

# Set the DJANGO_SETTINGS_MODULE environment variable
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'transpvisback.settings')

# Load Django settings
django.setup()
from apps.endpoints.models import MLRequest  # Import your MLRequest model

def load_data_from_csv(csv_file):
    with open(csv_file, 'r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            # Create MLRequest object from CSV row
            ml_request = MLRequest(
                input_data=row['input_data'],
                full_response=row['full_response'],
                response=row['response'],
                feedback=row['feedback'],
                created_at=datetime.strptime(row['created_at'], '%Y-%m-%d %H:%M:%S.%f'),
                parent_mlalgorithm_id=row['parent_mlalgorithm_id']  # Assuming this is the ID of the parent MLAlgorithm
            )
            ml_request.save()

if __name__ == '__main__':
    csv_file_path = 'db.sqlite3.csv'
    load_data_from_csv(csv_file_path)
