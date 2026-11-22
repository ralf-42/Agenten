// Fiktive Beispieldaten & deterministische Tools für 4 Domänen (Bildungsdemo)

export const DOMAINS = {
  insurance: {
    name: "Versicherung",
    claims: {
      CLM001: {
        id: "CLM001",
        type: "Wasserschaden",
        claim_amount: 22000,
        deductible: 2500,
        policy_limit: 50000,
        fraud_score: 0.12,
        police_report: true,
        notes: "Rohrbruch im Erdgeschoss, Handwerker-Rechnung liegt vor."
      },
      CLM002: {
        id: "CLM002",
        type: "Auffahrunfall",
        claim_amount: 14500,
        deductible: 1000,
        policy_limit: 25000,
        fraud_score: 0.84,
        police_report: false,
        notes: "Kein Polizeibericht; gemeldete Verletzungen passen nicht zur geringen Aufprallgeschwindigkeit."
      },
      CLM003: {
        id: "CLM003",
        type: "Sturmschaden Dach",
        claim_amount: 24200,
        deductible: 1500,
        policy_limit: 23000,
        fraud_score: 0.18,
        police_report: false,
        notes: "Wetterdienst bestätigt Sturm; Schadenssumme liegt nahe am Deckungslimit."
      }
    },
    memory: [
      "Korrektur Sachbearbeitung: Selbstbehalt immer explizit vom Schadensbetrag abziehen und Deckungslimit prüfen.",
      "Policy-Regel: Interne Betrugsscores niemals gegenüber Versicherungsnehmern erwähnen."
    ]
  },

  clinical: {
    name: "Klinik / Medikation",
    patients: {
      P001: {
        id: "P001",
        age: 74,
        medications: ["Amlodipin 5mg", "Ramipril 5mg"],
        bp: "148/88 mmHg",
        allergies: ["Penicillin"]
      },
      P004: {
        id: "P004",
        age: 68,
        medications: ["Warfarin 5mg"],
        bp: "132/80 mmHg",
        allergies: []
      }
    },
    interactions: {
      "warfarin+aspirin": {
        severity: "HOCH",
        safe: false,
        reason: "Schweres Blutungsrisiko durch doppelte Hemmung der Blutgerinnung."
      },
      "blutdrucksenker+pseudoephedrin": {
        severity: "HOCH",
        safe: false,
        reason: "Abschwellende Erkältungsmittel erhöhen den Blutdruck und schwächen Antihypertensiva."
      },
      "warfarin+paracetamol": {
        severity: "NIEDRIG",
        safe: true,
        reason: "In niedriger Kurzzeitdosierung (max. 2g/Tag) unter ärztlicher Rücksprache deutlich sicherer als NSAR/Aspirin."
      }
    }
  },

  career: {
    name: "Karriereberatung",
    applicant: {
      name: "Anna M. (fiktiv)",
      background: "B.A. Marketing, 2 Jahre Kampagnen-Management",
      goal: "Einstieg als UX-Designerin"
    },
    allowed_certifications: [
      "Google UX Design Certificate",
      "Nielsen Norman UX Cert",
      "CareerFoundry UX Bootcamp"
    ]
  },

  drug: {
    name: "Pharma-Forschung",
    compounds: {
      "QT-9901": {
        id: "QT-9901",
        hepatotoxicity: "POSITIV (ALT 5.2x ULN)",
        herg_risk: "NIEDRIG",
        repro_tox: "UNAUFFÄLLIG",
        ames_test: "NEGATIV",
        risk_level: "HIGH"
      },
      "DM-3350": {
        id: "DM-3350",
        chemistry_status: "Synthese stabil, Reinheit 99,2 %",
        hepatotoxicity: "NEGATIV",
        herg_risk: "NIEDRIG",
        repro_tox: "FEHLT (Bewertung ausstehend)",
        ames_test: "NEGATIV",
        ind_ready: "GO unter Auflage (Reproduktionstoxizität nachreichen)"
      },
      "CMP-7740": {
        id: "CMP-7740",
        hepatotoxicity: "FAIL (Leberschädigung)",
        herg_risk: "FAIL (QT-Verlängerung)",
        repro_tox: "FAIL (Teratogenitätssignal)",
        ames_test: "PASS"
      }
    }
  }
};

// Deterministische Tool-Funktionen (englische Namen gemäß Kurskonvention)
export const TOOLS = {
  get_claim(claim_id) {
    return DOMAINS.insurance.claims[claim_id] || null;
  },
  calc_settlement(claim_amount, deductible, policy_limit) {
    const raw = Math.max(0, claim_amount - deductible);
    return Math.min(raw, policy_limit);
  },
  check_drug_interaction(drug_a, drug_b) {
    const key = `${drug_a.toLowerCase()}+${drug_b.toLowerCase()}`;
    return DOMAINS.clinical.interactions[key] || {
      severity: "UNBEKANNT",
      safe: false,
      reason: "Keine Freigabe ohne fachärztliche Prüfung."
    };
  },
  get_patient_vitals(patient_id) {
    return DOMAINS.clinical.patients[patient_id] || null;
  },
  validate_certifications(cert_list) {
    const allowed = DOMAINS.career.allowed_certifications;
    const invalid = cert_list.filter((c) => !allowed.includes(c));
    return {
      valid: invalid.length === 0 && cert_list.length > 0,
      invalid,
      allowed
    };
  },
  check_compliance_rules(compound_id) {
    const c = DOMAINS.drug.compounds[compound_id];
    if (!c) return { decision: "NO-GO", failed_rules: ["Unbekannter Wirkstoff"] };
    const checks = [
      { rule: "Hepatotoxizität", pass: !String(c.hepatotoxicity).startsWith("FAIL") },
      { rule: "hERG-Kardiotoxizität", pass: !String(c.herg_risk).startsWith("FAIL") },
      { rule: "Reproduktionstoxizität", pass: !String(c.repro_tox).startsWith("FAIL") },
      { rule: "Ames-Test", pass: !String(c.ames_test).startsWith("FAIL") }
    ];
    const failed = checks.filter((x) => !x.pass).map((x) => x.rule);
    return {
      decision: failed.length === 0 ? "GO" : "NO-GO",
      checks,
      failed_rules: failed
    };
  }
};
