---
tags:
- spacy
- token-classification
language:
- en
model-index:
- name: en_bert_fine_tuned_ner
  results:
  - task:
      name: NER
      type: token-classification
    metrics:
    - name: NER Precision
      type: precision
      value: 0.8826268309
    - name: NER Recall
      type: recall
      value: 0.8940748747
    - name: NER F Score
      type: f_score
      value: 0.8883139705

---

This is a BERT model for Named Entity Recognition, fine-tuned on OntoNotes v5 using Spacy in coNLL-2003 format and BIO tagged.
For more details: https://github.com/nicoladisabato/ner-with-transformers

| Feature | Description |
| --- | --- |
| **Name** | `en_bert_fine_tuned_ner` |
| **Version** | `0.0.0` |
| **spaCy** | `>=3.5.0,<3.6.0` |
| **Default Pipeline** | `transformer`, `ner` |
| **Components** | `transformer`, `ner` |
| **Vectors** | 0 keys, 0 unique vectors (0 dimensions) |
| **Sources** | n/a |
| **License** | n/a |
| **Author** | [n/a]() |

### Label Scheme

<details>

<summary>View label scheme (18 labels for 1 components)</summary>

| Component | Labels |
| --- | --- |
| **`ner`** | `CARDINAL`, `DATE`, `EVENT`, `FAC`, `GPE`, `LANGUAGE`, `LAW`, `LOC`, `MONEY`, `NORP`, `ORDINAL`, `ORG`, `PERCENT`, `PERSON`, `PRODUCT`, `QUANTITY`, `TIME`, `WORK_OF_ART` |

</details>

### Accuracy

| Type | Score |
| --- | --- |
| `ENTS_F` | 88.83 |
| `ENTS_P` | 88.26 |
| `ENTS_R` | 89.41 |
| `TRANSFORMER_LOSS` | 135007.00 |
| `NER_LOSS` | 132971.85 |