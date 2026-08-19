# PLAN — Umbau zu Onepager (mikaschieferdecker.de)

Konkreter Umsetzungsplan auf Basis von **UMBAU.md**. Reihenfolge folgt strikt
der Arbeitsreihenfolge aus UMBAU.md, Teil „Reihenfolge der Arbeit" (Punkte 1–9).

**Arbeitsweise laut UMBAU:** Punkte einzeln abarbeiten, nach jedem Punkt
anhalten und Ergebnis zeigen, **noch nicht committen**. Kein Framework, keine
neuen Build-Tools. Keine erfundenen Zahlen/Testimonials/Namen.

> ⚠️ **Vor Umsetzung klären:** Es gibt einige Punkte, die in UMBAU.md nicht
> (eindeutig) geregelt sind. Sie sind unten im Abschnitt **„Offene Punkte /
> Annahmen"** gesammelt und mit `‹A›` markiert. Bitte diese vor bzw. spätestens
> bei Schritt 7 (Löschen + Redirects) bestätigen.

---

## Bestandsaufnahme (Ist-Zustand im Repo)

- Statische Site, gebaut über `build.js` (kopiert Quelle → `dist/`, ersetzt
  `<!--#include header-->` / `<!--#include footer-->` aus `partials/`, ergänzt
  SEO-Meta/Favicons, erzeugt `sitemap.xml`). Deploy per GitHub Action via FTP
  mit `mirror -R --delete` → gelöschte Quelldateien verschwinden automatisch
  vom Server, `sitemap.xml` wird automatisch neu erzeugt.
- **Seiten aktuell:** `index.html`, `blog.html`, `kontakt.html`, `projekte.html`,
  `ueber.html`, `impressum.html`, `datenschutz.html`, `404.html`
  - `leistungen/` = **12** Seiten (nicht 16 wie im UMBAU-Fließtext; die
    Redirect-Tabelle in UMBAU listet genau diese 12 → stimmt mit Repo überein).
  - `blog/` = **14** Artikel.
  - `projekte/` = **3** Detailseiten (`climaqx`, `pinkchilli`, `indira-indorf`).
- `partials/header.html` (Mega-Menü), `partials/footer.html`.
- `.htaccess` vorhanden (Host-/HTTPS-Kanonik, Clean-URLs, diverse Alt-Redirects).
- Weitere Dateien: `contact-handler.php`, `analyse-handler.php`, `llms.txt`,
  `robots.txt`, `site.webmanifest`, Favicons, `css/ js/ images/ fonts/`.

---

## Datei-Übersicht: Neu / Geändert / Gelöscht

### Neu erstellen
- [ ] `PLAN.md` (diese Datei) — **erledigt in diesem Schritt**.
- [ ] Keine neuen HTML-Seiten. Der gesamte Onepager lebt in `index.html`
      (UMBAU: „gesamter Onepager in einer HTML-Datei"). Die Hero-Umsatzkurve
      ist ein **inline-SVG** in `index.html`, keine separate Datei.

### Ändern
- [ ] `index.html` — kompletter Umbau zum Onepager (Sektionen + Anker, Reihen-
      folge nach Teil 3).
- [ ] `partials/header.html` — Mega-Menü raus, Anker-Navigation rein, Sticky +
      Smooth-Scroll (Teil 2).
- [ ] `partials/footer.html` — Nicht-Shopify-Links entfernen, auf Anker-Links
      umstellen, Tagline Shopify-only.
- [ ] `.htaccess` — neue 301-Redirects ergänzen, bestehende (nun ins Leere
      zeigende) Redirects aktualisieren. **Infrastruktur-Regeln (Host, HTTPS,
      Clean-URLs) unangetastet lassen** (UMBAU: „ergänze sie, statt sie zu
      überschreiben").
- [ ] `llms.txt` — auf Shopify-only umschreiben, gelöschte URLs entfernen
      `‹A›` (siehe Offene Punkte).
- [ ] `impressum.html`, `datenschutz.html`, `404.html` — nur Text/Meta auf
      Nicht-Shopify-Erwähnungen prüfen (z. B. 404-Text „direkt zu den
      Leistungen"). Bleiben eigenständige Seiten.

### Löschen
- [ ] Root: `blog.html`, `kontakt.html`, `projekte.html`, `ueber.html`
- [ ] Ordner `leistungen/` samt **12** Dateien:
      `setup-launch`, `migration`, `relaunch`, `optimierung`, `lokales-seo`,
      `onpage-seo`, `ladezeit-performance`, `keyword-recherche`,
      `website-erstellen-lassen`, `wordpress-freelancer`, `website-relaunch`,
      `ui-ux-design`
- [ ] Ordner `blog/` samt **14** Artikeln.
- [ ] Ordner `projekte/` samt **3** Detailseiten
      (`climaqx`, `pinkchilli`, `indira-indorf`) — Inhalte von climaqx +
      pinkchilli wandern als Cases in den Onepager; indira-indorf (Nicht-Shopify)
      entfällt ersatzlos.
- [ ] `analyse-handler.php` — verwaist (kein HTML referenziert es, `shop-analyse`
      existiert nicht mehr) → löschen `‹A›` (UMBAU schweigt dazu).
- [ ] Optional: ungenutzte Bilder nach dem Umbau (z. B. `indira-indorf.webp`,
      ggf. `ibzirr.webp`, `ba-before/after.webp`) — nur wenn nirgends mehr
      referenziert. Kein Muss.

### Behalten (unverändert)
- [ ] `impressum.html`, `datenschutz.html`, `404.html` (nur Textprüfung, s. o.)
- [ ] `contact-handler.php` — Kontaktformular des Onepagers verdrahtet darauf
      (Wiring bei Umsetzung prüfen `‹A›`).
- [ ] `build.js`, `robots.txt`, `site.webmanifest`, Favicons, `css/`, `js/`,
      `fonts/`, `images/` (genutzte), `.github/`.
- [ ] `sitemap.xml` wird von `build.js` automatisch neu erzeugt — kein manueller
      Eingriff.

---

## Redirect-Plan `.htaccess`

**Wichtig:** Apache-301 kann **keinen Anker (`#…`) anhängen** (UMBAU-Hinweis).
Alle Redirects gehen daher serverseitig auf `/`; der ideale Anker-Sprung laut
UMBAU-Tabelle ist informativ in Spalte „UMBAU-Ideal" notiert. UMBAU bezeichnet
den einfachen 301 auf `/` ausdrücklich als „ausreichend und empfohlen".
Neue/aktualisierte Redirects werden **vor** den Clean-URL-Regeln (aktuell
Regeln 3–5) einsortiert, im vorhandenen 301-Block.

### Neu hinzuzufügende Regeln

| Alte URL | UMBAU-Ideal | .htaccess-301 (real) |
|---|---|---|
| `/leistungen/setup-launch` | `/#shop-einrichten` | `/` |
| `/leistungen/migration` | `/#shop-einrichten` | `/` |
| `/leistungen/relaunch` | `/#shop-einrichten` | `/` |
| `/leistungen/optimierung` | `/#shopify-wachstum` | `/` |
| `/leistungen/lokales-seo` | `/#shopify-wachstum` | `/` |
| `/leistungen/onpage-seo` | `/#shopify-wachstum` | `/` |
| `/leistungen/ladezeit-performance` | `/#shopify-wachstum` | `/` |
| `/leistungen/keyword-recherche` | `/#shopify-wachstum` | `/` |
| `/leistungen/website-erstellen-lassen` | `/` | `/` |
| `/leistungen/wordpress-freelancer` | `/` | `/` |
| `/leistungen/website-relaunch` | `/` | `/` |
| `/leistungen/ui-ux-design` | `/` | `/` |
| `/projekte` | `/#projekte` | `/` |
| `/ueber` | `/#ueber` | `/` |
| `/kontakt` | `/#kontakt` | `/` |
| `/blog` | `/` | `/` |
| `/blog/*` (14 Artikel) | `/` (UMBAU-Textvorgabe) | `/` |
| `/projekte/climaqx` | `/#projekte` ✔ | `/#projekte` (Flag `NE`) |
| `/projekte/pinkchilli` | `/#projekte` ✔ | `/#projekte` (Flag `NE`) |
| `/projekte/indira-indorf` | `/#projekte` ✔ | `/#projekte` (Flag `NE`) |

> **Entscheidung Mika:** Projekt-Detailseiten leiten auf `/#projekte`.
> Technisch via `RewriteRule … /#projekte [R=301,L,NE]` — das `NE`-Flag
> verhindert, dass Apache das `#` zu `%23` kodiert, sodass der Anker im
> Location-Header erhalten bleibt.

Konkret als kompakte Catch-all-Regeln (decken auch die alten Slug-Varianten mit ab):

```apache
# Onepager-Konsolidierung: alte Seiten-URLs → Startseite (Anker clientseitig)
RewriteRule ^leistungen(/.*)?$        / [R=301,L]
RewriteRule ^projekte(/.*)?$          / [R=301,L]
RewriteRule ^blog(/.*)?$              / [R=301,L]
RewriteRule ^ueber(?:\.html)?/?$      / [R=301,L]
RewriteRule ^kontakt(?:\.html)?/?$    / [R=301,L]
```

### Bestehende Regeln aktualisieren (Ketten vermeiden → direkt auf `/`)

Diese zeigen aktuell auf Seiten, die gelöscht werden; ohne Anpassung entstünden
301-Ketten (schlecht für SEO-Linkkraft, was UMBAU explizit erhalten will):

- [ ] `/ratgeber`, `/ratgeber/*` → aktuell `/blog`, `/blog/*` → **auf `/`**.
- [ ] `/projekt-anfrage` → aktuell `/kontakt` → **auf `/`**.
- [ ] Block „1c" (alte Leistungs-Slugs: `websites`, `unternehmenswebsites`,
      `shopify`, `seo-betreuung`, `webdesign`, `onlineshops`, `seo`,
      `schnittstellen`, `webentwicklung`) → wird durch die neue Catch-all-Regel
      `^leistungen(/.*)?$ → /` **automatisch abgedeckt**; alte Einzelregeln
      können entfernt werden.
- [ ] `/shop-check`, `/shop-analyse` → aktuell `/kontakt` → **auf `/`**.

### Unverändert lassen
- [ ] Regel 0 (kanonischer Host), Regel 1 (HTTPS-Zwang), Regel 2
      (`index.html` raus), Regel 3–5 (Clean-URL-Auflösung), `ErrorDocument 404`.

---

## Inhalts-Mapping (welcher Bestand → welche Sektion)

| Onepager-Sektion (Anker) | Quelle |
|---|---|
| Hero (`#top`) | `index.html` Hero — Neubau Shopify-only (Schritt 3) |
| Ergebnisse (`#ergebnisse`) | vorhandene +67 %/+50 %-Kacheln (`.result-metrics`), direkt unter Hero |
| Das Problem (`#problem`) | **neu**, Kurztext nach UMBAU 3.3 (Traffic liegt brach) |
| Angebot/Methode (`#methode`) mit `#shop-einrichten` + `#shopify-wachstum` | **neue Struktur**; Inhalte adaptiert aus den 12 Leistungsseiten (Setup/Migration/Relaunch → Stufe 1; Optimierung, Conversion, Ladezeit/Performance, OnPage-SEO → Stufe 2 Retainer) |
| Retainer-Ablauf (`#ablauf`) | bestehende Prozess-/Timeline-Komponente → monatlicher Kreislauf Analyse→Optimierung→Report |
| Projekte/Cases (`#projekte`) | `projekte/climaqx.html` + `projekte/pinkchilli.html` → Problem→Ziel→Lösung→Ergebnis; `indira-indorf` entfällt |
| Stimmen (`#stimmen`) | bestehende 2 Testimonials + Signal „Pink Chilli wird weiterhin betreut" |
| Über mich (`#ueber`) | `ueber.html` |
| FAQ (`#faq`) | bestehende FAQ aus `index.html`, Shopify-only |
| Kontakt (`#kontakt`) | Wizard-Formular aus `kontakt.html` + `contact-handler.php`, „Antwort in 24 h", Statusumkehr-Text (UMBAU 4.4) |

---

## Checkliste nach UMBAU-Arbeitsreihenfolge

### Schritt 1 — Grundgerüst Onepager  ✅ ERLEDIGT (noch nicht committet)
- [x] In `index.html` alle Sektionen als leere, korrekt angeankerte Blöcke in
      der Reihenfolge aus Teil 3 angelegt: `#top`, `#ergebnisse`, `#problem`,
      `#methode` (`#shop-einrichten`, `#shopify-wachstum`), `#ablauf`,
      `#projekte`, `#stimmen`, `#ueber`, `#faq`, `#kontakt`.
- [x] `partials/header.html`: Anker-Navigation (Methode/Ergebnisse/Projekte/
      Über mich + Kontakt-Button „Kostenloses Erstgespräch"), Mega-Menü entfernt.
      Nav-Links absolut (`/#…`), damit sie auch von Impressum/Datenschutz greifen.
- [x] Sticky-Header sichergestellt (bereits `position:sticky`); Auto-Hide beim
      Scrollen in `js/main.js` entfernt → Header bleibt sichtbar (UMBAU Teil 2).
- [x] Smooth-Scroll (bereits `scroll-behavior:smooth`) + `scroll-padding-top:90px`
      in `css/style.css` ergänzt, damit Überschriften nicht unter dem Header liegen.
- [x] Verifiziert: Build ok, 1×H1, JSON-LD valide, kein Horizontal-Overflow
      (Desktop/Mobil), Anker-Sprung landet bei 90px (Header 81px), Mobile-Drawer
      öffnet mit den 4 Anker-Links.
- [x] **Ergebnis gezeigt — nicht committet (auf Wunsch).**

### Schritt 2 — Bestehende Inhalte in Sektionen übernehmen
- [ ] Hero, Ergebnisse, Projekte, Testimonials, Über, FAQ, Kontakt gemäß
      Inhalts-Mapping in die Blöcke einsetzen (bestehende Klassen/Grid
      wiederverwenden).
- [ ] **Anhalten, Ergebnis zeigen.**

### Schritt 3 — Hero auf reines Shopify + Zielgruppen-Filter
- [ ] Aussage: „Ich mache Shopify-Shops jeden Monat umsatzstärker." Kein
      „Websites"-Halbsatz.
- [ ] Zielgruppen-Filter-Zeile (UMBAU 4.1), z. B. „Für Shopify-Shops, die schon
      verkaufen und mehr aus ihrem Traffic wollen." **Keine** feste Umsatzgrenze.
- [ ] CTA „Kostenloses Erstgespräch".
- [ ] *Optional* dezent animierte Umsatzkurve (inline-SVG, „wenn möglich").
- [ ] **Anhalten, Ergebnis zeigen.**

### Schritt 4 — Angebot zweistufig
- [ ] Stufe 1 „Shop einrichten" (`#shop-einrichten`): Setup/Migration/Relaunch,
      einmalig, Einstieg.
- [ ] Stufe 2 „Shopify-Wachstum" (`#shopify-wachstum`): monatlicher Retainer,
      **visuell dominant**; Abschnitte: Conversion-Optimierung, Ladezeit/
      Performance, OnPage-SEO.
- [ ] Retainer-Name zentral als Arbeitstitel „Shopify-Wachstum" definieren
      (UMBAU 4.3, Platzhalter — s. Offene Punkte).
- [ ] **Anhalten, Ergebnis zeigen.**

### Schritt 5 — Retainer-Ablauf-Sektion
- [ ] Monatlicher Kreislauf Analyse → Optimierung → Report → wieder (`#ablauf`),
      ersetzt die alte, bei „Livegang" endende Prozess-Sektion.
- [ ] **Anhalten, Ergebnis zeigen.**

### Schritt 6 — Cases Climaqx + Pink Chilli
- [ ] Beide als ausführliche Cases nach Problem→Ziel→Lösung→Ergebnis (UMBAU 4.2).
- [ ] Nur echte Zahlen: Climaqx +67 % (60.000 € → 100.000 €), Pink Chilli
      +50 % (30.000 € → 45.000 €); beide weiterhin monatlich betreut.
- [ ] Vorher/Nachher mit einem Satz Kontext.
- [ ] **Anhalten, Ergebnis zeigen.**

### Schritt 7 — Alte Seiten löschen + Redirects
- [ ] 33 HTML-Seiten löschen (4 Root + 12 leistungen + 14 blog + 3 projekte),
      Ordner `leistungen/`, `blog/`, `projekte/` entfernen.
- [ ] `.htaccess`: neue Catch-all-301 ergänzen, bestehende Ketten-Redirects auf
      `/` aktualisieren (siehe Redirect-Plan). Impressum + Datenschutz behalten.
- [ ] `analyse-handler.php` löschen `‹A›`.
- [ ] **Anhalten, Ergebnis zeigen.**

### Schritt 8 — Meta-Tags, Footer, Fließtexte Shopify-only
- [ ] `index.html`: Title + Description auf Shopify-only.
- [ ] `partials/footer.html`: Nicht-Shopify-Links/Tagline entfernen.
- [ ] `llms.txt` auf Shopify-only umschreiben `‹A›`.
- [ ] Fließtexte/FAQ auf WordPress, UI/UX, „Website", Nicht-Shopify durchsuchen
      und entfernen. Auch `impressum/datenschutz/404` Textcheck.
- [ ] **Anhalten, Ergebnis zeigen.**

### Schritt 9 — Interne Links prüfen
- [ ] Alle internen Links (`index.html`, Header, Footer) von alten Seiten-URLs
      auf Anker-Links (`#…`) umstellen.
- [ ] Prüfen, ob noch etwas auf gelöschte URLs verweist (Grep über `href`).
- [ ] `node build.js` + Linkcheck; Sichtprüfung Desktop/Mobil.
- [ ] **Anhalten, Ergebnis zeigen.**

---

## Offene Punkte / Annahmen `‹A›`

**Von Mika entschieden (Stand jetzt):**
1. ✔ **Projekt-Detailseiten-Redirects** → **`/#projekte`** (via `NE`-Flag,
   siehe Redirect-Plan). Erledigt in der Tabelle.
2. ✔ **Retainer-Name** → Arbeitstitel **„Shopify-Wachstum"** bestätigt; zentral
   definiert, später in einem Schritt ersetzbar.
3. ✔ **`llms.txt`** → wird auf Shopify-only umgeschrieben (Schritt 8).

**Noch offen:**
4. **`analyse-handler.php`** — verwaist (kein HTML referenziert es mehr). Löschen?
5. **Kontaktformular-Wiring** — `contact-handler.php` bleibt; aktuell referenziert
   kein HTML den Handler direkt sichtbar (evtl. via JS). Bei Umsetzung des
   `#kontakt`-Formulars die Verdrahtung auf `contact-handler.php` verifizieren.
6. **Hero-Umsatzkurve** — laut UMBAU „wenn möglich" (optional). Als optionales
   inline-SVG geplant; kann bei Bedarf entfallen.

---

## Nicht-Ziele (aus UMBAU, zur Sicherheit)
- Kein aggressiver Bro-Marketing-Ton, keine feste Umsatz-Mindestgrenze im Hero,
  keine künstliche Verknappung/„Bewerbung", keine erfundenen/aufgeblähten Zahlen.
- Kein neues Framework, keine neuen Build-Tools.
- Nur Impressum + Datenschutz bleiben separate Seiten; alles andere wird Onepager
  oder entfällt.
