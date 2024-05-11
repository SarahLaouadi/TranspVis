import spacy
import spacy_transformers
import os

class Xner_model:
    def __init__(self): 
        CURRENT_DIR = os.path.dirname(__file__)
        self.nlp = spacy.load(CURRENT_DIR + '/XLNET_ner/model-best')
        
    def mlmodel(self, input_data):
        try:
            # Process the extracted text using the loaded spaCy NER model
            doc = self.nlp(input_data)

            entities_list = []
            if doc.ents:
                # Iterate through the named entities (entities) recognized by the model
                for ent in doc.ents:
                    # Print the recognized text and its corresponding label
                    if ent.label_ in ['ORG', 'PERSON']:
                        print(ent.text, "  ->>>>  ", ent.label_)
                        entities_list.append({"entity": ent.text, "label": ent.label_})
            else:
                print("No entities found in the document.")
            return {"paragraph":input_data,"entities": entities_list, "status": "OK"}
        except Exception as e:
            return {"status": "Error", "message": str(e)}