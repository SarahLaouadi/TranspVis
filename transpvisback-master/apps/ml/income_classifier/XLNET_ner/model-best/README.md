---
tags:
- spacy
- token-classification
language:
- en
model-index:
- name: en_xlnet_fine_tuned_ner
  results:
  - task:
      name: NER
      type: token-classification
    metrics:
    - name: NER Precision
      type: precision
      value: 0.8847416707
    - name: NER Recall
      type: recall
      value: 0.9002161737
    - name: NER F Score
      type: f_score
      value: 0.8924118449
---

This is a XLNet model for Named Entity Recognition, fine-tuned on OntoNotes v5 using Spacy in coNLL-2003 format and BIO tagged. 
For more details: https://github.com/nicoladisabato/ner-with-transformers

| Feature | Description |
| --- | --- |
| **Name** | `en_xlnet_fine_tuned_ner` |
| **Version** | `0.0.0` |
| **spaCy** | `>=3.5.1,<3.6.0` |
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
| `ENTS_F` | 89.24 |
| `ENTS_P` | 88.47 |
| `ENTS_R` | 90.02 |
| `TRANSFORMER_LOSS` | 124848.21 |
| `NER_LOSS` | 196123.19 |