# ic-ware.eu — Website veröffentlichen

Statische Website. Kein Server, keine Datenbank, keine Cookies, kein Tracking.
Schriften liegen lokal im Ordner (DSGVO-sicher).

## Auf GitHub Pages live schalten

1. Auf github.com neues Repository anlegen, z. B. `ic-ware-website` (Public).
2. Den **kompletten Inhalt dieses Ordners** hochladen (Add file → Upload files).
   Wichtig: die Dateien selbst, nicht den Ordner drumherum.
3. Settings → Pages → Source: `Deploy from a branch` → Branch: `main` / `root` → Save.
4. Nach ein paar Minuten ist die Seite unter `https://<benutzer>.github.io/ic-ware-website/` erreichbar.

## Eigene Domain (ic-ware.eu)

1. Im Repo eine Datei namens `CNAME` anlegen, Inhalt: `ic-ware.eu`
2. Beim Domain-Anbieter diese DNS-Einträge setzen:

   A-Records für `ic-ware.eu` →
       185.199.108.153
       185.199.109.153
       185.199.110.153
       185.199.111.153

   CNAME für `www` → `<benutzer>.github.io`

3. Settings → Pages → Custom domain: `ic-ware.eu` → Save
4. Haken bei „Enforce HTTPS" setzen (erscheint nach ein paar Minuten).

## Vor dem Live-Gang noch erledigen

- [ ] `impressum.html`: Rechtsform, Straße + Hausnummer, ggf. Telefon und USt-IdNr.
- [ ] `datenschutz.html`: dieselben Angaben (oben im Abschnitt „Verantwortlicher")
- [ ] Postfach `kontakt@ic-ware.eu` einrichten — darauf laufen alle Anfragen
- [ ] Referenz-Freigabe von Yellotools einholen, falls der Name genannt werden soll
      (aktuell steht dort nur „Werbetechnik-Hersteller in NRW")
- [ ] `partnerprogramm.html`: Provisionssatz (aktuell 10 %) und Laufzeit der
      Zuordnung (aktuell 12 Monate) bestaetigen oder anpassen
- [ ] Partnerbedingungen als PDF aufsetzen — die Seite beschreibt das Programm,
      ersetzt aber keinen Vertrag. Einmal anwaltlich pruefen lassen.
- [ ] `.eu`-Domain: Inhaber muss Wohnsitz oder Sitz in der EU haben. Bei einer
      GbR aus Windeck ist das erfuellt, muss aber bei der Registrierung
      nachgewiesen werden koennen.

Die gelb markierten Stellen auf den Rechtsseiten sind genau die offenen Felder.

## Dateien

    index.html            Startseite (Ablauf, Produkte, Anfrage-Assistent)
    kanzlei-manager.html  Produktseite
    auftrags-import.html  Produktseite
    ueber-uns.html        Postkarten — jeder bearbeitet seinen eigenen Block
    partnerprogramm.html  Partnerprogramm mit Bewerbungsformular
    impressum.html        Pflichtangaben
    datenschutz.html      Pflichtangaben
    404.html              Fehlerseite
    assets/               CSS, JavaScript, Schriften, Touch-Icon
    favicon.ico           Icon fürs Browser-Tab
    sitemap.xml           für Suchmaschinen
    robots.txt
