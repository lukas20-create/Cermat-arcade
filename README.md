# 👾 CERMAT ARCADE: Retro Herní Příprava na Přijímací Zkoušky

Moderní a interaktivní webová aplikace pro procvičování CERMAT testů (přijímacích zkoušek na střední školy) v retro arkádovém stylu 80. a 90. let (pixel art, neonová grafika, tmavý režim, 8-bitové zvukové efekty a CRT filtry).

---

## 🚀 Jak aplikaci spustit

Aplikace je vytvořena jako čistá, moderní webová aplikace (HTML5 + CSS3 + Vanilla ES6+ JS + Web Audio API) **bez nutnosti instalovat Node.js nebo jakékoliv knihovny**.

1. Otevřete soubor `index.html` v libovolném moderním webovém prohlížeči (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).
   - Umístění: `C:\Users\lukyc\.gemini\antigravity\scratch\cermat-arcade\index.html`
2. Můžete na soubor dvakrát kliknout v Průzkumníku souborů nebo jej přetáhnout do okna prohlížeče.

---

## 🎮 Hlavní Funkce a Struktura Aplikace

### 1. Systém uživatelů a registrace
- **Úvodní obrazovka:** Přepínání mezi *Přihlásit se*, *Nová registrace* a **Anonymní režim**.
- **🕶️ Anonymní režim pro žáky (Procvičování jako Host):**
  - Vstup **bez hesla a bez jména** na 1 kliknutí.
  - Volba třídy (9.A nebo 9.B) pro zobrazení odpovídajících úkolů.
  - **Důležité:** V tomto režimu se **žádné úspěchy, získané XP ani splněné úlohy neukládají do trvalé paměti**. Žák má neomezený přístup k celému hernímu obsahu, ale po zavření prohlížeče se relace resetuje.
  - V přihlášeném/registrovaném profilu se naopak veškerý postup, XP a odemčení avatary trvale ukládají do `localStorage`.
- **Výběr role při registraci:**
  - **Žák:** Povinný výběr třídy (**9.A** nebo **9.B**).
  - **Učitel:** Pro registraci učitele je **nutné zadat bezpečnostní PIN: `5231`**.
- **🔐 Ochrana učitelského režimu (PIN kód: `5231`):**
  - Jakýkoliv vstup do Učitelského velínu (přihlášení, přepnutí role, kliknutí na rychlé přihlášení učitele) vyžaduje zadání bezpečnostního PINu **5231**.
  - Obsahuje virtuální arkádový číselník i podporu zadávání z fyzické klávesnice.
- **Rychlé demo přihlášení (1 klik pro testování):**
  - 🎒 **Filip Novák (Žák 9.A)** – 680 XP, avatar Neonový Ninja, rozehrané testy
  - 🎒 **Aneta Veselá (Žákyně 9.B)** – 940 XP, avatar Kyber Kočka, vysoká úspěšnost
  - 🎓 **Mgr. Martin Procházka (Učitel)** – Přístup k administraci obou tříd (vyžaduje PIN `5231`)

### 2. Žákovský režim (Herní Lobby a Testy)
- **Hlavní menu (Lobby):**
  - Výběr předmětu: **Český jazyk** nebo **Matematika**.
  - Zobrazení přehledu postupu a rychlý náhled nejnovějších zpráv z nástěnky.
- **Struktura testů (5 sad po 50 úlohách pro každý předmět = 500 úloh celkem):**
  - **Český jazyk:**
    - *Level 1: Pravopisné bludiště* (vyjmenovaná slova, koncovky, bje/bě, velká písmena)
    - *Level 2: Větný rozbor & Skladba* (větné členy, vedlejší věty, poměry)
    - *Level 3: Slovní zásoba & Frazeologie* (synonyma, frazémy, význam slov)
    - *Level 4: Text & Literární druhy* (čtení s porozuměním, lyricko-epické žánry)
    - *Level 5: Finální CERMAT Bosstour* (komplexní ostrý simulátor)
  - **Matematika:**
    - *Level 1: Čísla a zlomky* (početní operace, zlomky, mocniny a jednotky)
    - *Level 2: Rovnice & Výrazy* (úpravy výrazů, vzorce $(a\pm b)^2$, lineární rovnice)
    - *Level 3: Procenta & Finanční logika* (základ, procenta, poměry a úměrnosti)
    - *Level 4: Planimetrie & Úhly* (Pythagorova věta, obvody, obsahy a úhly)
    - *Level 5: Slovní úlohy & Boss Fight* (pohybové úlohy, společná práce, logika)
- **Herní rozhraní (Arcade Test Runner):**
  - Počítadlo životů (❤️❤️❤️).
  - Combo násobič XP (🔥 COMBO x1.5, x2, x3 za sérii správných odpovědí).
  - Výběr úlohy s možností přímého skoku na libovolnou úlohu 1 až 50.
  - Vizuální feedback (zelená/červená neonová záře, 8-bit zvuky, edukativní vysvětlení řešení).
  - **Game Over obrazovka:** Při vyčerpání životů arkádové okno *INSERT COIN & Zkusit znovu*.
  - **Stage Cleared obrazovka:** Shrnutí skóre, úspěšnosti a získaných bodů.

### 3. Gamifikace & Avatar Shop
- **XP a Úrovně:**
  - Hráč získává XP za každou správně vyřešenou úlohu (včetně combo bonusů).
  - V záhlaví je neustále viditelný stav XP, ukazatel postupu a hodnost (např. *Začátečník, Pixelový Poutník, Větný Alchymista, Pán Rovnic, Cermat Architekt, Cermat Legenda*).
  - **Level Up animace:** Oslavný vyskakovací dialog s fanfárou při postupu na vyšší level.
- **Obchod s avatary (Avatar Shop):**
  - Virtuální obchod s pixel art avatary (Základní, Běžný, Vzácný, Epický, Legendární).
  - Nákup za nasbírané XP body s okamžitým odečtem a možností nasazení.
  - Aktivní avatar se ihned promítne do herního HUDu v záhlaví aplikace.

### 4. Nástěnka a Domácí úkoly
- Automatické filtrování zpráv a úkolů podle třídy přihlášeného žáka (**9.A** nebo **9.B**).
- Přehledné karty úkolů se stavem *Ke splnění* / *Splněno*.
- Tlačítko pro okamžité spuštění zadané testovací sady jedním klikem.

### 5. Učitelský režim (Admin Dashboard)
- Samostatný portál **UČITELSKÝ VELÍN / ADMIN MATRIX**:
  1. **Zadávání úkolů:** Formulář pro přiřazení sady úloh třídě 9.A, 9.B nebo oběma třídám současně s termínem a pokyny.
  2. **Správa aktualit:** Formulář pro publikování novinek a oznámení přímo na žákovskou nástěnku s možností cílení.
  3. **Tvorba obsahu (Editor úloh):** Tvorba nových CERMAT úloh (zadání, 4 možnosti A-D, označení správné odpovědi, edukativní vysvětlení a XP odměna) s okamžitým uložením do herní databáze.
  4. **👥 Správa žáků, výsledků a účtů (Nové!):**
     - **Přehledná tabulka s vyhledáváním a filtry:** Vyhledávání podle jména, filtrování podle třídy (9.A / 9.B) a řazení (podle XP, jména nebo vyřešených úloh).
     - 👁️ **Detailní přehled výsledků jednotlivce:** Zobrazení podrobného rozpadu všech 5 sad z Českého jazyka (0-50 úloh) a 5 sad z Matematiky (0-50 úloh) s procenty úspěšnosti a stavem domácích úkolů.
     - 🔄 **Mazání / Resetování výsledků:** Možnost vynulovat veškerý postup žáka (splněné úlohy a XP body) bez smazání jeho účtu, aby mohl začít znovu.
     - 🗑️ **Trvalé odstranění účtu žáka:** Možnost kompletně smazat žákovský účet ze systému (s bezpečnostním potvrzovacím dialogem).

### 6. Technické a audio-vizuální prvky
- **8-Bit Zvukový Syntetizér (Web Audio API):**
  - Reálné arkádové zvuky generované v prohlížeči (mince/XP, správná odpověď, bzučák chyby, fanfára postupu, Game Over tóny).
  - Tlačítko pro okamžité vypnutí/zapnutí zvuku (🔊 / 🔇) v záhlaví.
- **CRT Scanlines Filtr:**
  - Přepínatelný retro filtr obrazovky (starý CRT monitor s linkami a luminiscencí).
- **Responzivita:**
  - Plně přizpůsobeno pro mobilní telefony, tablety i velké stolní monitory.
- **Lokální perzistence (LocalStorage):**
  - Veškerý postup, zakoupené avatary, nově vytvořené úlohy učitelem a zadané úkoly se ukládají v prohlížeči.
