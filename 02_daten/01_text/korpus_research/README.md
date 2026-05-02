# Research-Korpus: RAG fuer Einsteiger

## Thema

**Retrieval-Augmented Generation einfach erklaert: Wie LLMs mit externem Wissen verlaesslicher antworten.**

## Warum dieses Thema passt

- Einsteigergeeignet: Der Use Case ist direkt verstaendlich: Fragen an Dokumente stellen und Antworten mit Quellen erhalten.
- Passt zum Kurs: RAG, Embeddings, ChromaDB, Citations, Evaluation, HITL und Agenten lassen sich daran natuerlich aufbauen.
- Gute Dokumentlage: Es gibt frei zugaengliche arXiv-Surveys und Grundlagenpapiere.
- Didaktisch sauber: Der Unterschied zwischen Keyword-Suche, semantischer Suche und quellengebundener Antwort ist gut demonstrierbar.
- Datenschutzarm: Es wird mit oeffentlichen wissenschaftlichen Texten gearbeitet.

## Korpusumfang

Der Korpus enthaelt fuer die erste Kursversion **15 kuratierte PDFs**. Das ist gross genug fuer Retrieval-, Chunking- und Eval-Uebungen, aber noch klein genug fuer Einsteiger und Colab-Laufzeiten.

Eine spaetere Erweiterung auf 30-50 Dokumente bleibt moeglich, ist fuer die erste anwendungsorientierte Kursversion aber nicht erforderlich.

## Enthaltene Dokumente

| Datei | arXiv | Rolle im Korpus |
|---|---|---|
| `rag_survey_2312_10997.pdf` | https://arxiv.org/abs/2312.10997 | Zentrale RAG-Uebersicht: naive, advanced und modular RAG |
| `retrieval_augmented_text_generation_2202_01110.pdf` | https://arxiv.org/abs/2202.01110 | Aeltere Grundlagenuebersicht zu retrieval-augmented text generation |
| `rag_text_generation_llms_2404_10981.pdf` | https://arxiv.org/abs/2404.10981 | Neuere RAG-Sicht mit Pre-Retrieval, Retrieval, Post-Retrieval und Generation |
| `llms_in_practice_2304_13712.pdf` | https://arxiv.org/abs/2304.13712 | Praktische LLM-Nutzung, Grenzen, Use Cases und Non-Use-Cases |
| `ragas_evaluation_2309_15217.pdf` | https://arxiv.org/abs/2309.15217 | RAG-Evaluation ohne vollstaendige Ground-Truth |
| `ares_rag_evaluation_2311_09476.pdf` | https://arxiv.org/abs/2311.09476 | Automatisierte RAG-Evaluation und synthetische Trainingsdaten fuer Evaluatoren |
| `ragchecker_2408_08067.pdf` | https://arxiv.org/abs/2408.08067 | Feingranulare Diagnose von Retrieval- und Generierungsfehlern |
| `robust_rag_irrelevant_context_2310_01558.pdf` | https://arxiv.org/abs/2310.01558 | Robustheit gegen irrelevante oder stoerende Kontexte |
| `chain_of_note_2311_09210.pdf` | https://arxiv.org/abs/2311.09210 | Robustere RAG-Antworten durch Notizen und Unsicherheitsbehandlung |
| `raft_domain_specific_rag_2403_10131.pdf` | https://arxiv.org/abs/2403.10131 | Anpassung von Modellen an domaenenspezifische RAG-Aufgaben |
| `raptor_tree_retrieval_2401_18059.pdf` | https://arxiv.org/abs/2401.18059 | Baum-/Hierarchie-basierte Retrieval-Strategie |
| `query_rewriting_rag_2305_14283.pdf` | https://arxiv.org/abs/2305.14283 | Query-Rewriting fuer bessere Retrieval-Ergebnisse |
| `active_retrieval_augmented_generation_2305_06983.pdf` | https://arxiv.org/abs/2305.06983 | Aktives Retrieval waehrend der Generierung |
| `llm_autonomous_agents_survey_2308_11432.pdf` | https://arxiv.org/abs/2308.11432 | Ueberblick zu LLM-basierten autonomen Agenten |
| `prompt_engineering_survey_2402_07927.pdf` | https://arxiv.org/abs/2402.07927 | Prompting-Techniken und Grenzen |

## Empfohlene Nutzung im Kurs

1. M11/M12: Keyword-Suche vs. semantische Suche auf 3-5 ausgewaehlten PDFs.
2. M13/M14: RAG-Chain und RAG-Agent mit Quellenpflicht auf dem gesamten Korpus.
3. M15/M24: Eval-Fragen gegen Retrieval- und Antwortqualitaet pruefen.
4. M17/M23: Unsicherheit, Out-of-Corpus-Fragen, Prompt Injection und HITL diskutieren.
5. M36: Teilnehmer bauen eine Variante mit Teilkorpus oder eigenem Zusatzkorpus.

## Gute Eval-Fragetypen

| Typ | Beispiel |
|---|---|
| Faktisch | Welche drei Hauptkomponenten nennt ein RAG-System? |
| Vergleich | Wie unterscheidet sich naive RAG von advanced RAG? |
| Anwendung | Warum kann RAG Halluzinationen reduzieren? |
| Grenze | Welche Risiken bleiben trotz Retrieval bestehen? |
| Negativ | Welche Aussagen macht der Korpus zur Bildgenerierung mit Diffusionsmodellen? |
