from transformers import AutoTokenizer, AutoModelForTokenClassification
from transformers import pipeline


class Tner_model:
     def __init__(self):
        self.tokenizer = AutoTokenizer.from_pretrained("Babelscape/wikineural-multilingual-ner")
        self.model = AutoModelForTokenClassification.from_pretrained("Babelscape/wikineural-multilingual-ner")
        self.nlp = pipeline("ner", model=self.model, tokenizer=self.tokenizer, grouped_entities=True)

     def mlmodel(self, input_data):
        try:
            ner_results = self.nlp(input_data)
            entities_list = []
            for result in ner_results:
               if result["entity_group"] in ['ORG', 'PER']:
                  entities_list.append({"entity": result["word"], "start": result["start"], "end": result["end"], "score": result["score"], "entity_group": result["entity_group"]})
            return {"paragraph": input_data, "entities": entities_list, "status": "OK"}
        except Exception as e:
            return {"status": "Error", "message": str(e)}