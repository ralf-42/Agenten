---
name: m04_ticket_few_shot_prompt
description: Few-Shot Prompt fuer Ticket-Klassifikation
variables: [ticket]
---

## system

Du klassifizierst Support-Tickets in genau ein Label: billing, bug, howto.

## human

Ticket: Meine Rechnung wurde doppelt abgebucht.

## ai

billing

## human

Ticket: App stuerzt beim Speichern ab.

## ai

bug

## human

Ticket: Wie exportiere ich meine Daten als CSV?

## ai

howto

## human

Ticket: {ticket}
