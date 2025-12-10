# Documentation Technique Publicodes

## Introduction

Ce projet utilise **Publicodes**, un langage open-source pour exprimer les règles métier liées aux aides à la rénovation énergétique. Publicodes permet de:

* **Définir des règles complexes** en YAML/Publicodes
* **Évaluer des situations** en fonction de réponses utilisateur
* **Calculer les aides éligibles** pour chaque profil

* **Gérer les dépendances** entre variables

**Dépendances clés**
```json
{
  "publicodes": "^1.6.1",
  "@publicodes/react-ui": "^1.5.4"
}
```
---

## Structure technique du projet

### Architecture

#### Structure générale du projet

```
reno/
├── app/
│   ├── règles/                    # Définitions des règles Publicodes
│   │   ├── index.yaml             # Règles de base et structure
│   │   ├── rules.ts               # Compilation des règles
│   │   ├── ampleur.publicodes     # Aides par ampleur
│   │   ├── copropriete.publicodes # Aides copropriété
│   │   ├── CEE.publicodes         # Certificats d'Économie d'Énergie
│   │   ├── MPRA.publicodes        # MaPrimeRénov' accompagné
│   │   ├── mpa/                   # Ma Prime Adapt et autres
│   │   ├── gestes/                # Définition des gestes
│   │   └── revenus.yaml           # Paliers de revenus
│   ├── simulation/
│   │   ├── Form.tsx               # Composant formulaire principal
│   │   ├── simulationConfig*.yaml
│   │   └── page.tsx               # Page simulation
├── components/
│   ├── publicodes/                # Utilitaires Publicodes
│   │   ├── utils.ts               # Manipulation de noms
│   │   ├── situationUtils.ts      # Gestion de situation
│   │   ├── getNextQuestions.ts    # Logique de questions
│   │   └── questionType.ts        # Types de questions
│   └── ... autres composants
```

### Structure des règles

#### 1. Fichier `app/règles/index.yaml` - Règles de base

C'est le point d'entrée principal définissant la structure générale.

**Variable principale: `aides`**
```yaml
aides:
  variations:
    - si:
        toutes ces conditions:
          - parcours d'aide = "rénovation énergétique"
          - vous . propriétaire . statut = 'copropriété'
      alors: copropriété . montant
    - si:
        toutes ces conditions:
          - parcours d'aide = "rénovation énergétique"
          - une de ces conditions:
              - toutes ces conditions:
                  - projet . définition = "travaux connus"
                  - est défini: projet . définition . catégories travaux envisagées
                  - est défini: projet . définition . travaux envisagés
              - projet . définition = "travaux inconnus"
      alors:
        somme:
          - ampleur . tous les dispositifs # ampleur.yaml
          - MPR . non accompagnée . montant
    - si: parcours d'aide = "autonomie"
      alors: mpa . montant
    - si: parcours d'aide = "sécurité salubrité"
      alors: MPLD . montant
```

**Logique:** La variable `aides` évalue le montant total des aides selon le parcours choisi.

*Contexte: Ménage*
```yaml
ménage . revenu:
  titre: Revenu fiscal de référence
  question: Quel est votre revenu fiscal de référence ?
  unité: €
  par défaut: 0 €
  bornes intelligentes: oui
  sous-titre: Le revenu se trouve...
  description: Saisissez le RFR...

ménage . personnes:
  titre: La composition de votre ménage
```

*Contexte: Logement*
```yaml
logement . type:
  titre: Type de logement
  question: Le logement est-il une maison ou un appartement ?
  une possibilité parmi:
    possibilités:

logement . surface:
  titre: Surface habitable

logement . période de construction:
  titre: Période de construction
  par défaut: "'au moins 15 ans'"

logement . commune:
  titre: Code INSEE de la commune
  formule: logement . adresse
```

*Contexte: Vous (Propriétaire)*
```yaml
vous . propriétaire . statut:
  question: Êtes-vous propriétaire ?
  une possibilité parmi:
    possibilités:
      - 'propriétaire'
      - 'acquéreur'
      - 'non propriétaire'
      - 'copropriété'
  par défaut: "'propriétaire'"

vous . propriétaire . condition:
  formule:
    une de ces conditions:
      - statut = 'propriétaire'
      - statut = 'acquéreur'
```

#### 2. Compilation des règles (rules.ts)

```typescript
// Le fichier rules.ts agrège toutes les règles avec des préfixes
const rules = {
  ...index,
  ...revenus,
  ...prefix(gestes, 'gestes'),
  ...prefix(chauffage, 'gestes'),
  ...ampleur,
  ...MPRA,
  ...CEE,
  // ... autres
}
```

Les **préfixes** organisent les règles hiérarchiquement:
* `gestes . chauffage . PAC` au lieu de `PAC`
* `mpa . situation demandeur` au lieu de `situation demandeur`

---

## Configuration de simulation

#### Fichiers de configuration

Chaque fichier YAML configure **l'ordre et le type de questions** posées à l'utilisateur.

*`simulationConfig.yaml` - Configuration complète*
```yaml
prioritaires:
  - parcours d'aide

  # Questions copropriété
  - copropriété . id
  - copropriété . condition 15 ans
  - copropriété . nombre de logements
  - copropriété . condition résidence principale
  - copropriété . gain énergétique

  # Questions MPA
  - mpa . situation demandeur
  - mpa . occupant . condition age ou handicap

  # Questions de base
  - vous . propriétaire . statut
  - logement . type
  - logement . surface
  - logement . commune
  - ménage . personnes
  - ménage . revenu

  # Questions métier
  - DPE . actuel
  - projet . définition
```

**Clés importantes:**
* `prioritaires`: Questions à poser dans cet ordre
* `préface` (optionnel): Questions à poser avant l'évaluation
* Cet ordre **prime** sur le calcul automatique de dépendances Publicodes

#### Logique de chargement (Form.tsx)

```typescript
// Le simulateur détecte si "parcours d'aide" est dans les prioritaires
const form = simulationConfig.prioritaires.find((e) => e.includes('parcours'))
  ? 'full'
  : null

// Charge la configuration appropriée
const { objectif, depuisModule, ...situationSearchParams } = searchParams
const target = objectif ? decodeDottedName(objectif) : 'aides'
```

---

## Utilitaires Publicodes

#### 1. `situationUtils.ts` - Gestion de la situation utilisateur

*Encodage/Décodage de noms pointés*
```typescript
encodeDottedName('vous . propriétaire . statut')
// → 'vous.propriétaire.statut'

decodeDottedName('vous.propriétaire.statut')
// → 'vous . propriétaire . statut'
```

*Récupération des questions répondues*
```typescript
getAnsweredQuestions(searchParams, rules)
// Retourne les questions pour lesquelles l'utilisateur a fourni une réponse validée
// Une réponse validée est marquée avec validValueMark ('*')
```

*Extraction de la situation utilisateur*
```typescript
getSituation(searchParams, rules)
// Convertit les paramètres de recherche en situation Publicodes
// Gère:
// - Les valeurs numériques vs texte
// - Les zéros inutiles
// - La migration d'anciennes situations (via compatibility.ts)
```

#### 2. `utils.ts` - Manipulation de noms de règles

```typescript
getRuleName('vous . propriétaire . statut')
// → 'statut'

getRuleTitle(dottedName, rules)
// Récupère le titre d'une règle depuis les données

parentName('vous . propriétaire . statut')
// → 'vous . propriétaire'

textValueEquality('"propriétaire"', 'propriétaire')
// Vérifie l'égalité de valeurs texte Publicodes
```

#### 3. `getNextQuestions.ts` - Logique de questions

```typescript
getNextQuestions(evaluation, answeredQuestions, questionsConfig)
// Retourne la liste des questions à poser ensuite
```

**Stratégie:**
1. Récupère les variables manquantes (`missingVariables`) de Publicodes
2. Filtre les questions déjà répondues
3. Applique l'ordre de `questionsConfig.prioritaires`
4. Ajoute les questions de `préface` (questions artificielles)
5. Trie par importance (ordre dans config > score Publicodes)

#### 4. `questionType.ts` - Détermination du type de question

Détermine comment afficher une question (input texte, nombre, select, etc.)

---

## Workflow de simulation

#### 1. Initialisation (Form.tsx)

```typescript
// 1. Créer une instance du moteur Publicodes
const engine = useMemo(
  () => new Publicodes(rules, { logger: {...} }),
  [rules]
)

// 2. Extraire la situation depuis les params URL
const situation = getSituation(situationSearchParams, rules)
const answeredQuestions = getAnsweredQuestions(situationSearchParams, rules)

// 3. Valider la situation
const validatedSituation = Object.fromEntries(
  Object.entries(situation).filter(([k, v]) => answeredQuestions.includes(k))
)
```

#### 2. Évaluation

```typescript
// 1. Appliquer la situation
engine.setSituation(validatedSituation)

// 2. Évaluer l'objectif (par défaut 'aides')
const evaluation = engine.evaluate('aides')

// 3. Extraire les questions suivantes
const nextQuestions = getNextQuestions(
  evaluation,
  answeredQuestions,
  simulationConfig
)
```

#### 3. Affichage

```typescript
// Mode détail (si ?details est défini)
if (searchParams['details']) {
  return <AideDetails {...} />
}

// Mode normal
return <InputSwitch {...} />
```

#### 4. Réponse utilisateur

Quand l'utilisateur répond:
1. La réponse est validée
2. Elle est encodée avec `validValueMark` ('*')
3. Les params URL sont mis à jour
4. La situation est recalculée
5. Les questions suivantes sont déterminées

`?vous.propriétaire.statut=propriétaire*&logement.type=maison*&ménage.revenu=45000*`

---

## Exemples pratiques

#### Exemple 1: Ajouter une nouvelle aide

**Étape 1:** Définir la règle
```yaml
# Dans app/règles/ma-nouvelle-aide.publicodes

ma nouvelle aide:
  titre: Ma Nouvelle Aide

ma nouvelle aide . montant:
  titre: Montant de l'aide
  formule:
    variations:
      - si: projet . définition = "travaux connus"
        alors: 5000 €
      - sinon: 0 €

ma nouvelle aide . éligibilité:
  formule:
    toutes ces conditions:
      - vous . propriétaire . condition
      - logement . au moins 15 ans
      - ménage . revenu < 60000 €
```

**Étape 2:** Importer dans `rules.ts`
```typescript
import maNewhelp from '@/app/règles/ma-nouvelle-aide.publicodes'

const rules = {
  ...index,
  ...maNewhelp,  // Ajouter ici
  // ...
}
```

**Étape 3:** Intégrer dans `aides`
```yaml
# Dans app/règles/index.yaml
aides:
  variations:
    # ... autres variations
    - si: parcours d'aide = "rénovation énergétique"
      alors:
        somme:
          - ampleur . tous les dispositifs
          - ma nouvelle aide . montant  # Ajouter ici
```

#### Exemple 2: Ajouter une question au formulaire

**Étape 1:** Ajouter la règle
```yaml
# Dans app/règles/index.yaml

mon contexte . ma question:
  question: Votre question ici ?
  titre: Titre de la question
  description: Description détaillée...
  une possibilité parmi:
    possibilités:
      - 'option1'
      - 'option2'
  par défaut: "'option1'"
```

**Étape 2:** Ajouter à la configuration
```yaml
# Dans simulationConfigAll.yaml
prioritaires:
  - parcours d'aide
  - mon contexte . ma question  # Ajouter ici
  - autres . questions
```

---

## Bonnes pratiques

#### 1. Nommage des règles

✅ **Bon**
```yaml
logement . surface:
  titre: Surface habitable
  question: Quelle est la surface habitable ?
```

❌ **Mauvais**
```yaml
surf:  # Trop générique
```

#### 2. Utiliser les variations plutôt que des formules complexes

✅ **Bon**
```yaml
montant:
  formule:
    variations:
      - si: revenu < 30000 €
        alors: 10000 €
      - si: revenu < 60000 €
        alors: 5000 €
      - sinon: 0 €
```

❌ **Mauvais**
```yaml
montant:
  formule: revenu < 30000 ? 10000 : (revenu < 60000 ? 5000 : 0)
```

#### 3. Bien structurer les questions

```yaml
ma question:
  question: La question à afficher
  titre: Le titre (optionnel, par défaut = question)
  sous-titre: Sous-titre avec contexte
  description: Description détaillée en Markdown
  par défaut: Une valeur par défaut sensée
  # Ou pour une sélection
  une possibilité parmi:
    possibilités:
      - 'option1'
      - 'option2'
```
---

## Optimisations et performance

Trop de questions prioritaires ralentit l'algorithme:

```yaml
# ❌ À éviter
prioritaires:
  - question1
  - question2
  - ... 50 questions

# ✅ Bon
prioritaires:
  - parcours d'aide              # Décision clé
  - vous . propriétaire . statut # Décision clé
  - logement . type              # Décision clé
  - logement . commune           # Filtre important
  - ménage . revenu              # Filtre important
  # ... max 15-20
```

---

## Debugging

#### 1. Logger les variables manquantes

```typescript
const evaluation = engine.evaluate('aides')
console.log('Missing variables:', evaluation.missingVariables)
// Output: {
//   "vous . propriétaire . statut": 1,
//   "ménage . revenu": 0.8,
//   "logement . commune": 0.6
// }
```

#### 2. Inspecter une valeur calculée

```typescript
const revenuValue = engine.evaluate('ménage . revenu')
console.log(revenuValue)
// Output: {
//   nodeValue: 45000,
//   nodeKind: "constant",
//   unit: "€/an",
//   ...
// }
```

## Erreurs courantes

| Erreur              | Cause                        | Fix                                 |
|---------------------|------------------------------|-------------------------------------|
| Rule not found      | Typo dans nom                | Vérifier espaces-points-espaces     |
| Missing variation   | Pas tous cas couverts        | Ajouter `sinon:`                    |
| Circular dependency | Règle dépend d'elle-même     | Refactoriser                        |
| Wrong unit          | Unités incompatibles         | Convertir: `5000 €` pas `5000`      |


#### 3. Tracer les dépendances

```typescript
const dependencies = engine.getRule('MPR . montant').dependencies
console.log('MPR depends on:', dependencies)
// Output: ['ménage . revenu . classe', 'projet . gain . énergétique', ...]
```

---

## Diagrammes Architecture

### Structure des fichiers règles

```
┌──────────────────────────────────────────────────────────────┐
│                    FICHIERS RÈGLES RENO                       │
└──────────────────────────────────────────────────────────────┘

app/règles/
│
├─ index.yaml                    ┐
│  - Questions de base           │
│  - Structure générale           ├─ Règles de base
│  - Variable principale 'aides'  │
│  - Contexte: vous, logement     │
│                                 ┘
│
├─ rules.ts                      ┐
│  - Importe tous les fichiers   │
│  - Ajoute les préfixes         ├─ Compilation
│  - Crée l'objet final 'rules'  │
│                                 ┘
│
├─ ampleur.publicodes            ┐
│  - Calcul montants aides        │
│  - MPR, CEE, PTZ, etc          ├─ Calcul des aides
│  - Bonus et surcharges         │
│                                 ┘
│
├─ copropriete.publicodes        ┐
│  - Questions copropriété        │
│  - Éligibilité copro            ├─ Aides spécialisées
│  - Calcul montants              │
│                                 ┘
│
├─ revenus.yaml                  ┐
│  - Classes de revenu            │
│  - Paliers standard             ├─ Contexte ménage/revenus
│  - Paliers IdF                  │
│                                 ┘
│
├─ gestes/                       ┐
│  ├─ chauffage.yaml              │
│  ├─ isolation.yaml              ├─ Définition des gestes
│  └─ ...autres.yaml              │
│                                 ┘
│
├─ mpa/                          ┐
│  ├─ ma-prime-adapt.publicodes   │
│  ├─ credit-impot.publicodes     ├─ Aides autonomie
│  └─ ...autres.publicodes        │
│                                 ┘
│
├─ CEE.publicodes
├─ MPRA.publicodes               ┐
├─ PTZ.publicodes                │
├─ PAR.publicodes                ├─ Autres aides
├─ denormandie.publicodes        │
├─ taxe-fonciere.publicodes      │
└─ aides-locales.publicodes      ┘
```

### Hiérarchie des règles Publicodes

```
aides (OBJECTIF PRINCIPAL)
│
├─ parcours d'aide = "rénovation énergétique"
│  │
│  ├─ vous . propriétaire . statut = "copropriété"
│  │  │
│  │  └─ copropriété . montant
│  │      ├─ copropriété . éligibilité
│  │      │   ├─ vous . propriétaire . condition
│  │      │   ├─ copropriété . condition 15 ans
│  │      │   ├─ copropriété . nombre de logements
│  │      │   └─ ...
│  │      └─ copropriété . gain . énergétique
│  │
│  └─ vous . propriétaire . condition (propriétaire ou acquéreur)
│     │
│     └─ Somme d'aides individuelles
│         ├─ ampleur . tous les dispositifs
│         │   ├─ MPR . montant (MaPrimeRénov')
│         │   ├─ CEE . montant (Certificats d'Économie d'Énergie)
│         │   ├─ PTZ . montant (Prêt à Taux Zéro)
│         │   ├─ PAR . montant (Prêt d'Amélioration de Résidence)
│         │   ├─ Denormandie . montant
│         │   └─ taxe foncière . montant
│         └─ MPR . non accompagnée . montant
│
├─ parcours d'aide = "autonomie"
│  │
│  └─ mpa . montant (Ma Prime Adapt)
│      ├─ mpa . situation demandeur
│      ├─ mpa . occupant . condition age ou handicap
│      └─ mpa . bailleur . condition locataire
│
└─ parcours d'aide = "sécurité salubrité"
   │
   └─ MPLD . montant (Ma Prime Logement Décent)
```

### Orchestration Publicodes

```
┌─────────────────────────────────────────────────────────┐
│              MOTEUR PUBLICODES - ORCHESTRATION          │
└─────────────────────────────────────────────────────────┘

new Publicodes(rules)
│
├─ Parse toutes les règles
├─ Construit graphe de dépendances
└─ Prêt à évaluer

│
├─ setSituation({ 'règle': valeur, ... })
│  ├─ Stocke valeurs utilisateur
│  └─ Marque variables comme "définies"
│
├─ evaluate('aides')
│  ├─ Analyse dépendances de 'aides'
│  ├─ Évalue toutes les sous-règles
│  ├─ Calcule la valeur finale
│  │
│  └─ Retourne objet avec:
│     ├─ nodeValue: 10000 (montant calculé)
│     ├─ missingVariables: {...} (questions manquantes)
│     ├─ errors: [] (erreurs si aucune)
│     └─ unit: { numerators: ['€'] }
│
├─ getRule('ma règle')
│  └─ Retourne la définition de la règle
│
├─ Analyse missingVariables
│  ├─ Calcule score pour chaque variable manquante
│  └─ Trie par importance
│
└─ (Boucle)
   ├─ Frontend affiche question
   ├─ Utilisateur répond
   ├─ setSituation() avec nouvelle réponse
   └─ evaluate() recalcule → retour aux missingVariables
```

### Flux données
```
URL Params
    ↓ getSituation()
Situation (JS object)
    ↓ engine.setSituation()
Publicodes Engine
    ↓ engine.evaluate('aides')
Evaluation Result
    ↓ getNextQuestions()
Prochaines questions
    ↓
Form re-render avec InputSwitch
```

### État global de l'app

```
┌────────────────────────────────────────────────────────┐
│         ÉTAT GLOBAL DE LA SIMULATION                   │
└────────────────────────────────────────────────────────┘

URL (source de vérité)
    │
    ├─ rawSearchParams (React hook)
    │  └─ { vous.propriétaire.statut: 'propriétaire*', ... }
    │
    ├─ situation (decoded)
    │  └─ { 'vous . propriétaire . statut': 'propriétaire', ... }
    │
    ├─ answeredQuestions (validées)
    │  └─ ['vous . propriétaire . statut', 'ménage . revenu', ...]
    │
    ├─ validatedSituation (filtrée)
    │  └─ Seulement les questions répondues (answered)
    │
    ├─ engine.setSituation(validatedSituation)
    │  └─ Publicodes prêt à évaluer
    │
    ├─ evaluation = engine.evaluate('aides')
    │  ├─ nodeValue: 10000 (résultat)
    │  └─ missingVariables: {...} (prochaines questions)
    │
    └─ nextQuestions = getNextQuestions(evaluation, ...)
       └─ Questions triées à afficher
```

---

## Glossaire

### Termes Publicodes

| Terme                | Définition                          | Exemple                         |
|----------------------|-------------------------------------|----------------------------------|
| **Règle**            | Variable calculée en Publicodes      | `ménage . revenu . classe`       |
| **Noms pointés**     | Structure hiérarchique              | `vous . propriétaire . statut`   |
| **Formule**          | Comment calculer une règle           | `revenu * 10%`                  |
| **Variation**        | Branches conditionnelles             | `si X alors Y sinon Z`          |
| **Dépendance**       | Règle que la règle utilise           | `aides` dépend de `ménage . revenu` |
| **Variable manquante** | Donnée dont on a besoin            | Demander à l'utilisateur        |
| **Node**             | Objet d'évaluation                   | `{ nodeValue: 5000, unit: '€' }`|
| **Unit**             | Unité de mesure                      | `€`, `%`, `personne(s)`         |
| **applicabilité**    | Condition pour que règle existe       | `applicable si:`                |

### Termes du projet Reno

| Terme         | Définition                                      |
|---------------|-------------------------------------------------|
| **Parcours**  | Chemin utilisateur (rénovation, autonomie, sécurité) |
| **Situation** | État des réponses utilisateur                   |
| **Objectif**  | Règle à évaluer (par défaut: `aides`)           |
| **Configuration** | Ordre et sélection des questions             |
| **Geste**     | Travaux spécifiques (chauffage, isolation)      |
| **Ampleur**   | Montant d'une aide selon contexte               |
| **Éligibilité** | Est-ce qu'on peut avoir cette aide             |
| **RFR**       | Revenu Fiscal de Référence                      |
| **DPE**       | Diagnostic de Performance Énergétique           |

### Acronymes

| Acronyme | Signification                       |
|----------|-------------------------------------|
| **MPR**  | MaPrimeRénov'                       |
| **MPRA** | MaPrimeRénov' Accompagné            |
| **MPA**  | Ma Prime Adapt                      |
| **MPLD** | Ma Prime Logement Décent            |
| **CEE**  | Certificats d'Économie d'Énergie    |
| **PTZ**  | Prêt à Taux Zéro                    |
| **PAR**  | Prêt d'Amélioration de Résidence    |
| **DPE**  | Diagnostic de Performance Énergétique|
| **RFR**  | Revenu Fiscal de Référence          |
| **IdF**  | Île-de-France                       |
| **EPCI** | Établissement Public de Coopération Intercommunale |

---
