# UMBAU — mikaschieferdecker.de (Onepager)

Dieses Dokument beschreibt den vollständigen Umbau der Website zu einem
**Onepager**. Es ist das verbindliche Briefing. Halte dich strikt daran und
erfinde nichts dazu. Wenn etwas unklar ist, frag nach, bevor du Code änderst.

---

## Ziel des Umbaus

Die Website verkauft aktuell einmalige Projekte (Website erstellen,
Festpreis, Livegang, fertig). Das Geschäftsziel sind aber **monatliche
Retainer-Kunden**. Die Seite wird zu einem fokussierten Onepager umgebaut,
der auf ein zweistufiges Shopify-Angebot mit dem Retainer als Kern hinführt.

Die Website positioniert sich **zu 100 % auf Shopify**. Klassische Websites,
WordPress, UI/UX als eigenständige Angebote fallen komplett weg — sie
erscheinen nirgends mehr.

Positionierung in einem Satz:
> Ich mache Shopify-Shops jeden Monat umsatzstärker.

Belege (echte Zahlen, nur diese verwenden, nichts erfinden):
- Climaqx: Monatsumsatz +67 % seit Übernahme (60.000 € → 100.000 €)
- Pink Chilli: Monatsumsatz +50 % seit Übernahme (30.000 € → 45.000 €)
- Beide Shops werden weiterhin monatlich von Mika betreut (= Retainer)

---

## Teil 1 — Von Mehrseiten-Site zu Onepager

### Zielzustand der Seitenstruktur

Es gibt künftig im Kern **eine einzige Seite** (die Startseite / `index.html`)
mit allen Inhalten als Abschnitte, erreichbar über Anker-Navigation.

Daneben existieren nur noch:
- `/impressum` (Pflicht, bleibt eigene Seite)
- `/datenschutz` (Pflicht, bleibt eigene Seite)

ALLES andere wird Teil des Onepagers oder fällt weg:
- Alle 16 Leistungs-Unterseiten → entfallen, Inhalt wandert in Sektionen.
- `/projekte` → wird zur Projekte-Sektion auf dem Onepager.
- `/ueber` → wird zur Über-mich-Sektion.
- `/kontakt` → wird zur Kontakt-Sektion mit Formular am Seitenende.
- `/blog` → entfällt (falls vorhanden, aus Navigation entfernen; bestehende
  Blogartikel-URLs per 301 auf die Startseite umleiten, sofern es welche gibt).

### Redirects

Setze für JEDE alte URL eine dauerhafte 301-Weiterleitung auf die passende
Anker-Sektion des Onepagers oder auf die Startseite. So bleibt vorhandene
SEO-Linkkraft erhalten.

| Alte URL | 301 → Ziel |
|---|---|
| /leistungen/setup-launch | /#shop-einrichten |
| /leistungen/migration | /#shop-einrichten |
| /leistungen/relaunch | /#shop-einrichten |
| /leistungen/optimierung | /#shopify-wachstum |
| /leistungen/lokales-seo | /#shopify-wachstum |
| /leistungen/onpage-seo | /#shopify-wachstum |
| /leistungen/ladezeit-performance | /#shopify-wachstum |
| /leistungen/keyword-recherche | /#shopify-wachstum |
| /leistungen/website-erstellen-lassen | / |
| /leistungen/wordpress-freelancer | / |
| /leistungen/website-relaunch | / |
| /leistungen/ui-ux-design | / |
| /projekte | /#projekte |
| /ueber | /#ueber |
| /kontakt | /#kontakt |
| /blog | / |

Hinweis: 301-Redirects werden bei All-Inkl (Apache) über die `.htaccess` im
Web-Root gesetzt. Achtung: Anker (`#...`) werden serverseitig NICHT
weitergeleitet — ein Apache-301 kann nur auf die Seite `/` leiten, den Anker
hängt der Browser nicht automatisch an. Praktische Lösung: alte
Leistungs-URLs per 301 auf `/` leiten. Wenn ein direkter Sprung zur Sektion
gewünscht ist, das über eine kleine Weiterleitungsseite oder clientseitig
lösen — aber der einfache 301 auf `/` ist ausreichend und empfohlen.
Prüfe, ob bereits eine `.htaccess` existiert, und ergänze sie, statt sie zu
überschreiben.

---

## Teil 2 — Navigation (Anker statt Seiten)

Die Navigation wird zu einer Anker-Navigation innerhalb des Onepagers.
Kein aufklappbares Mega-Menü mehr.

Menüpunkte (scrollen zur jeweiligen Sektion):
- Methode / So funktioniert's   (→ #methode)
- Ergebnisse                    (→ #ergebnisse)
- Projekte                      (→ #projekte)
- Über mich                     (→ #ueber)
- Kontakt-Button (auffällig)    (→ #kontakt)

Sticky-Header, der beim Scrollen sichtbar bleibt, damit der Kontakt-Button
immer erreichbar ist. Smooth-Scroll zu den Ankern.

---

## Teil 3 — Sektionsreihenfolge des Onepagers

Der Onepager folgt einem durchgehenden Verkaufsbogen, der zum Retainer und
zum Erstgespräch hinführt. Reihenfolge:

1. **Hero** (#top)
   - Aussage: „Ich mache Shopify-Shops jeden Monat umsatzstärker."
   - Zielgruppen-Filter-Zeile (siehe Teil 4.1).
   - Klarer CTA: „Kostenloses Erstgespräch".
   - Wenn möglich dezent animierte Umsatzkurve (SVG, Linie zieht sich beim
     Laden nach oben). Rein Shopify — kein „Websites"-Halbsatz.

2. **Ergebnisse** (#ergebnisse)
   - +67 % / +50 % prominent, direkt unter dem Hero.

3. **Das Problem** (#problem)
   - Kurz: Shop läuft, aber Umsatz aus dem vorhandenen Traffic liegt brach.

4. **Angebot – zweistufig** (#methode)
   - Stufe 1: „Shop einrichten" (#shop-einrichten) — Setup/Migration/Relaunch,
     einmalig, der Einstieg.
   - Stufe 2: „Shopify-Wachstum" (#shopify-wachstum) — monatlicher Retainer,
     visuell dominant. Enthält als Abschnitte: Conversion-Optimierung,
     Ladezeit/Performance, OnPage-SEO

5. **So läuft der Retainer ab** (#ablauf)
   - Monatlicher Kreislauf: Analyse → Optimierung → Report → wieder.
   - Ersetzt die alte Prozess-Sektion, die bei „Livegang" endete. Sichtbar
     machen, dass die Zusammenarbeit nicht endet, sondern läuft.

6. **Projekte / Cases** (#projekte)
   - Climaqx und Pink Chilli als ausführliche Cases nach dem Schema
     Problem → Ziel → Lösung → Ergebnis (siehe Teil 4.2).
   - Vorher/Nachher mit einem Satz Kontext (was wurde besser, welche Zahl).

7. **Stimmen** (#stimmen)
   - Bestehende Testimonials, ergänzt um das Signal, dass Pink Chilli
     weiterhin betreut wird.

8. **Über mich** (#ueber)
   - Ein Ansprechpartner, kein Agentur-Pingpong. Schafft Vertrauen für eine
     monatliche Beziehung.

9. **FAQ** (#faq)
   - Einwände klären (Kosten, Dauer, bestehende Shops, Ansprechpartner).

10. **Kontakt** (#kontakt)
    - Erstgespräch-Formular am Seitenende. „Antwort in 24 h."
    - Statusumkehr-Formulierung (siehe Teil 4.4).

---

## Teil 4 — Bewährte Muster (adaptiert, in Mikas eigener Stimme)

Diese Muster stammen von einer starken Shopify-Referenzseite (ebenfalls ein
Onepager), sind aber bewusst an Mikas Positionierung angepasst: ehrlich,
nahbar, direkter Ansprechpartner. NICHT den aggressiven Marketing-Ton
übernehmen (kein „brutaler Umsatz", „Goldesel", „Profitmaschine"). Mikas
Stärke ist Vertrauen, nicht Einschüchterung.

### 4.1 Zielgruppen-Filter im Hero
Eine Zeile im Hero, die die Zielgruppe eingrenzt, ohne Arroganz. Z. B.:
> Für Shopify-Shops, die schon verkaufen und mehr aus ihrem Traffic wollen.
KEINE feste Umsatzgrenze („ab 50k") nennen, solange die Referenzlage das
nicht trägt.

### 4.2 Case-Struktur: Problem → Ziel → Lösung → Ergebnis
Climaqx und Pink Chilli als ausführliche Cases nach diesem Vierschritt.
Nur die zwei echten Cases, keine erfundenen Zahlen ergänzen. Mikas
Ehrlichkeit ist glaubwürdiger als Masse.

### 4.3 Name für den Retainer
Der monatliche Retainer bekommt einen klaren, verständlichen Namen, damit
aus „Pflege" ein Produkt wird. NICHT kryptisch abkürzen. Der Name zieht
durch die ganze Seite.
>>> PLATZHALTER — Mika wählt den finalen Namen. Vorschläge:
>>> „Monatliche Shop-Optimierung" / „Der Wachstums-Retainer" /
>>> „Shopify-Wachstumsprogramm".
>>> Bis zur Entscheidung Arbeitstitel „Shopify-Wachstum" verwenden und an
>>> einer zentralen Stelle definieren, damit er später in einem Schritt
>>> ersetzt werden kann.

### 4.4 Statusumkehr beim Kontakt
Das Erstgespräch so rahmen, dass beidseitig geprüft wird, ob es passt —
nicht Mika, der um den Auftrag bittet. Dezent, nicht „bewirb dich":
> In einem kurzen Erstgespräch schauen wir gemeinsam, ob ich der Richtige
> für deinen Shop bin.
KEINE künstliche Verknappung („nehme nur X Kunden").

### Was bewusst NICHT übernommen wird
- Aggressiver Bro-Marketing-Ton.
- Feste Umsatz-Mindestgrenze im Hero.
- Künstliche Verknappung / „Bewerbung" statt Anfrage.
- Erfundene oder aufgeblähte Kennzahlen.

---

## Regeln für die Umsetzung

- Statische HTML-Site, jetzt als Onepager. Kein Framework, keine Build-Tools
  einführen.
- Der gesamte Onepager liegt in einer HTML-Datei (Startseite). Nur
  Impressum und Datenschutz bleiben separate Dateien.
- HTML und CSS konsistent zu den bestehenden Komponenten halten (gleiche
  Klassen, gleiches Grid wiederverwenden, wo sinnvoll).
- Anker-IDs an den Sektionen setzen, Smooth-Scroll, Sticky-Header.
- Keine erfundenen Zahlen, Testimonials oder Kundennamen. Nur was in diesem
  Dokument steht oder bereits auf der Seite vorhanden ist.
- Bei jeder URL-Änderung den passenden 301-Redirect setzen.
- Alle Erwähnungen von WordPress, UI/UX, klassischen Websites und
  Nicht-Shopify-Leistungen entfernen — auch in Fließtexten, Meta-Tags
  (Title/Description!), Footer und FAQ. Die Seite spricht nur noch von Shopify.

---

## Reihenfolge der Arbeit (bitte einzeln abarbeiten)

Nacheinander abarbeiten, nicht alles auf einmal. Nach jedem Punkt anhalten
und das Ergebnis zeigen, noch nicht committen.

1. Grundgerüst des Onepagers anlegen: alle Sektionen als leere, aber korrekt
   angeankerte Blöcke in der Reihenfolge aus Teil 3. Navigation + Sticky-Header
   + Smooth-Scroll.
2. Inhalte der bestehenden Seiten in die passenden Sektionen übernehmen
   (Hero, Ergebnisse, Projekte, Testimonials, Über, FAQ, Kontakt).
3. Hero auf reines Shopify umstellen + Zielgruppen-Filter-Zeile.
4. Angebots-Sektion zweistufig aufbauen (Stufe 1 Einstieg, Stufe 2 Retainer
   dominant) inkl. der optimierten Retainer-Bestandteile als Abschnitte.
5. Retainer-Ablauf-Sektion (monatlicher Kreislauf) neu bauen.
6. Cases Climaqx + Pink Chilli nach Problem→Ziel→Lösung→Ergebnis ausbauen.
7. Alte Unterseiten (16 Leistungsseiten, projekte, ueber, kontakt, blog)
   löschen und alle 301-Redirects setzen. Impressum + Datenschutz behalten.
8. Meta-Tags (Title/Description), Footer und alle Fließtexte nach
   Nicht-Shopify-Erwähnungen durchsuchen und entfernen.
9. Interne Links prüfen: alte Seiten-Links durch Anker-Links (#...) ersetzen;
   verweist noch etwas auf gelöschte URLs?
