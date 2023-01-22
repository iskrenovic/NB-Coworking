# NB-Coworking
## Softver za olakšani rad Coworking prostorija i upravljanja rezervacijama
Izradili:
1. ***Dimitrije Iskrenović 17654***
2. ***Nemanja Najdanović 17835***
3. ***Nina Miljković 17801***

### Koncept

Softver je zamišljen da automatizuje i olakša zakazivanje prostora u coworking prostorijama i olakša upravljanje istih.  
Postoje 3 vrste korisnika:
* Vlasnik (Owner).
* Poslovni korisnik (Business).
* Privatni korisnik (Freelancer). 

**Vlasnik** može da kreira, obriše i menja prostore, sobe, mesta i opremu. Osim toga, ima mogućnost da odobri ili odbije rezervacije klijenata.

**Poslovni korisnik** ima mogućnost da pretražuje prostore i sobe i da rezerviše sobe. Poslovni korisnik ne može kao freelancer da zauzme samo jedno mesto jer je podrazumevano da je u pitanju tim od više ljudi.

**Privatni korisnik** ima mogućnost da pretražuje prostore, sobe i individualna mesta. On nema mogućnosti da zauzme celu prostojiu kao što to može poslovni korisnik, već samo jedno lično za sebe. 

### Tehnologija

Za backend smo korsitili Node.js a za frontend Vue.js.

Iskoristili smo sposobnosti Neo4j tehnologije kako bi implementirali sistem preporuke prostora korisnicima koji su već koristili platformu, tj rezervisali sobe ili mesta. Kao argumente za filtriranje preporučenih prostora koristili smo gradove u kojima su bili kao i da je cena na 10% od prethodno rezervisane cene. Ovim smo omogućili olakšanu pretragu prostorija na našoj platformi.

Kako bi mogli vlasnici prostora i korisnici da nesmetano komuniciraju međusobno u vidu razmene rezervacija, implementirali smo WebSocket sistem razmene poruka preko Redis-a. Kada klijenti pošalju rezervaciju, dovedeni su do ekrana na kome čekaju odogovor vlasnika prostora. 

Da bi ubrzali povratak informacija klijentima, iskoristili smo i sposobnosti Redis tehnologije za keširanje podataka i već odrađenih pretraga kako ne bi prebukirali bazu podataka sa upitima. 

### Pokretnaje
Kako bi se softver pokrenuo, potrebno je:
1. Pokrenuti **redis-server** na lokalnoj virtualnoj mašini Linux-a.
2. U folderu *Backend* i *coworking-front* pokrenuti komandu `npm install` (po potrebi `npm install --force`).
3. U folderu *Backend* preko *CMD-a* pokrenuti `npm start` 
4. U folderu *coworking-front* prekom *CMD-a* upisati komandu `npm run start`. 
5. Pristupiti web sajtu na adresi `http://localhost:8080`

### NAPOMENA: Sve atipične funkcije na backendu za koje smo smatrali da je potrebno dodatno objašnjenje imaju komentare iznad svoje deklaracije. 
