# Cotor – librărie independentă

Pagină de prezentare pentru Cotor, o librărie de cartier imaginară. Poți răsfoi rafturile, poți alcătui o listă de citit, poți rezerva un loc la evenimente și poți comanda o cutie cu cărți pe lună. Totul rulează în browser, fără biblioteci și fără server.

> Proiect demonstrativ: cărțile, autorii, evenimentele și prețurile sunt inventate.

## Ce poate face pagina

- **Dark / light mode** cu efect de pagină întoarsă. Alegerea se salvează și se respectă tema dispozitivului.
- **Hero animat:** cuvinte care plutesc și fug de mouse, carte 3D care se înclină, cotoare de cărți generate după lățimea ecranului.
- **Rafturi de cărți** cu filtre pe gen, tragere cu mouse-ul și navigare cu tastatura.
- **Fereastră pentru fiecare carte**, cu descriere, citat, preț, adăugare în listă și rezervare.
- **Listă de citit** într-un sertar lateral, cu copiere ca text și golire în doi pași.
- **Recomandări** ale librarilor și un selector de dispoziție care alege o carte.
- **Evenimente** cu locuri care scad la rezervare, calculate după data de azi.
- **Cutie lunară cu abonament:** alegi numărul de cărți, genurile și perioada, iar prețul se calculează singur.
- **Program** după ora din București și indicator Deschis / Închis.
- **Formular de newsletter** cu validare.
- **Mișcare la scroll:** apariții, cifre care se numără singure și numărul paginii din colț.
- **Responsive**, accesibil de la tastatură și cu respectarea setării „fără animații”.

## Structura proiectului

```
index.html   structura paginii
style.css    stilurile, temele și animațiile
script.js    toată logica paginii
```

## Cum îl rulezi local

1. Descarcă sau clonează proiectul.
2. Deschide `index.html` în browser, sau folosește extensia **Live Server** din VS Code.

Cele trei fișiere trebuie să fie în același folder.

## Cum îl pui online (GitHub Pages)

1. Urcă fișierele în repository, în rădăcină.
2. Mergi la **Settings → Pages**.
3. La *Source* alege **Deploy from a branch**, branch-ul **main** și folderul **/ (root)**.
4. După un minut, pagina apare la `https://numele-tau.github.io/numele-repo/`.

## Cum îl personalizezi

La începutul fișierului `script.js` găsești datele paginii:

- `RAW`: lista de cărți (titlu, autor, gen, preț, descriere, citat)
- `EVENTS`: evenimentele
- `HOURS`: programul librăriei
- `BOX_PRICE`: prețurile cutiei lunare

Culorile și fonturile sunt în variabilele de la începutul fișierului `style.css`.

## Tehnologii

HTML, CSS și JavaScript pur. Fonturile (Fraunces și Hanken Grotesk) vin de la Google Fonts.
