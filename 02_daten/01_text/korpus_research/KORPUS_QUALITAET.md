# Korpus-Qualitaetspruefung

**Stand:** 2026-05-02

## Ergebnis

Der Research-Korpus ist fuer die erste anwendungsorientierte Kursversion geeignet.

| Kriterium | Ergebnis |
|---|---|
| Umfang | 15 PDF-Dateien |
| Dateiformat | Alle Dateien haben gueltigen `%PDF`-Header |
| Thematische Perspektiven | RAG-Grundlagen, RAG-Evaluation, Robustheit, Query-Rewriting, Agenten, Prompt Engineering |
| Duplikate | Keine offensichtlichen Dateiduplikate nach Dateiname und Groesse |
| Datenschutz | Oeffentliche arXiv-Papiere, keine personenbezogenen Kursdaten |
| Einsteigerpassung | Geeignet, wenn im Unterricht mit Teilkorpus und gefuehrten Fragen gestartet wird |

## Dokumentgruppen

| Gruppe | Dateien |
|---|---|
| RAG-Grundlagen | `rag_survey_2312_10997.pdf`, `retrieval_augmented_text_generation_2202_01110.pdf`, `rag_text_generation_llms_2404_10981.pdf` |
| Praxis und Grenzen von LLMs | `llms_in_practice_2304_13712.pdf` |
| Evaluation | `ragas_evaluation_2309_15217.pdf`, `ares_rag_evaluation_2311_09476.pdf`, `ragchecker_2408_08067.pdf` |
| Robustheit und Unsicherheit | `robust_rag_irrelevant_context_2310_01558.pdf`, `chain_of_note_2311_09210.pdf` |
| Retrieval-Verbesserung | `raft_domain_specific_rag_2403_10131.pdf`, `raptor_tree_retrieval_2401_18059.pdf`, `query_rewriting_rag_2305_14283.pdf`, `active_retrieval_augmented_generation_2305_06983.pdf` |
| Agenten und Prompting | `llm_autonomous_agents_survey_2308_11432.pdf`, `prompt_engineering_survey_2402_07927.pdf` |

## Ground-Truth-Abdeckung

Das initiale Eval-Set deckt mindestens 10 Dokumente ab. Die Fragen sind bewusst als robuste Start-Ground-Truth formuliert: erwartete Quelle, erwartete Kurzantwort und erwartete Schluesselbegriffe sind angegeben.

| Datei | Abdeckung |
|---|---|
| `rag_survey_2312_10997.pdf` | q01, q02, q04, q20, e04, e09 |
| `retrieval_augmented_text_generation_2202_01110.pdf` | q05 |
| `rag_text_generation_llms_2404_10981.pdf` | q03 |
| `llms_in_practice_2304_13712.pdf` | q18 |
| `ragas_evaluation_2309_15217.pdf` | q06 |
| `ares_rag_evaluation_2311_09476.pdf` | q07 |
| `ragchecker_2408_08067.pdf` | q08 |
| `robust_rag_irrelevant_context_2310_01558.pdf` | q09, e05 |
| `chain_of_note_2311_09210.pdf` | q10, e06 |
| `raft_domain_specific_rag_2403_10131.pdf` | q11 |
| `raptor_tree_retrieval_2401_18059.pdf` | q12 |
| `query_rewriting_rag_2305_14283.pdf` | q13 |
| `active_retrieval_augmented_generation_2305_06983.pdf` | q14 |
| `llm_autonomous_agents_survey_2308_11432.pdf` | q15, q16, e07 |
| `prompt_engineering_survey_2402_07927.pdf` | q17, q19 |

## Hinweise fuer den Unterricht

- In M11/M12 zuerst mit 3-5 Dokumenten arbeiten, damit Chunking und Retrieval sichtbar bleiben.
- In M13/M14 den gesamten Korpus verwenden.
- In M15/M24 mit `eval_research.json` starten und Edge-Cases erst danach hinzunehmen.
- Lange Survey-Papiere koennen Retrieval dominieren; bei Bedarf pro Modul mit Teilkorpus arbeiten.
