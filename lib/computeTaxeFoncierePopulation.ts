import { parse, stringify } from 'jsr:@std/csv'

interface TaxeFonciereCommune {
  codeDepartement: string;
  codeCollectivite: string;
  nomCollectivite: string;
  fbExonerationPartielleVlAnciensEconomesTaux: string;
  fbNouvelleExonPartielleVlAnciensLogEconomesTaux: string;
  codeInsee?: string;
  population?: number;
  taux?: string;
}

const CSV_FILE = './data/exoneration_taxe_fonciere_population.csv';

const GEO_API_BASE_URL = Deno.env.get("GEO_API_BASE_URL");
if (!GEO_API_BASE_URL) {
  throw new Error("La variable d'environnement GEO_API_BASE_URL n'est pas définie !");
}

await updateCsvPopulation();

export async function updateCsvPopulation() {
  console.log("Début du traitement…");
  const data = await readCsv(CSV_FILE);
  const populationMap = await fetchAllPopulations();
  const seen = new Set<string>();
  const updated = data.map(line => processLine(line, seen, populationMap));
  await writeCsv(CSV_FILE, updated);
  console.log(`Fin de traitement – ${updated.length} lignes traitées`);
}

function processLine(
  line: TaxeFonciereCommune,
  seen: Set<string>,
  populationMap: Record<string, number>
): TaxeFonciereCommune {
  try {
  const codeDepartement = line.codeDepartement?.trim();
  const codeCollectivite = line.codeCollectivite?.trim();
  const nomCollectivite = line.nomCollectivite?.trim();
  const taux1 = line.fbNouvelleExonPartielleVlAnciensLogEconomesTaux?.trim();
  const taux2 = line.fbExonerationPartielleVlAnciensEconomesTaux?.trim();

  validateCommuneFields(codeDepartement, codeCollectivite, nomCollectivite, taux1, taux2);
  const codeInsee = codeDepartement + codeCollectivite;
  checkDuplicate(seen, codeInsee);
  const population = populationMap[codeInsee] ?? 0;
  const taux = taux1 || taux2;

  return { ...line, codeDepartement, codeCollectivite, nomCollectivite, codeInsee, population, taux };
  } catch (err) {
    console.error("Erreur lors du traitement de la ligne :", err.message);
    throw err;
  }
}

async function fetchAllPopulations(): Promise<Record<string, number>> {
  try {
    const res = await fetch(`${GEO_API_BASE_URL}/communes?fields=population`);
    if (!res.ok) throw new Error(`Failed to fetch communes`);
    const communes: { code: string; population: number }[] = await res.json();

    const populationMap: Record<string, number> = {};
    for (const commune of communes) {
      populationMap[commune.code] = commune.population ?? 0;
    }
    return populationMap;
  } catch (err) {
    console.error("Erreur API:", err);
    return {};
  }
}

async function readCsv(filePath: string): Promise<TaxeFonciereCommune[]> {
  console.log(`Chargement du fichier CSV : ${filePath}`);
  const rawData = await Deno.readTextFile(filePath);
  return parse(rawData, { skipFirstRow: true, strip: true }) as TaxeFonciereCommune[];
}

function checkDuplicate(seen: Set<string>, codeInsee: string) {
  if (seen.has(codeInsee)) {
    throw new Error(`Doublon détecté pour la commune, veuillez supprimer la ligne manuellement codeInsee: ${codeInsee}`);
  }
  seen.add(codeInsee);
}

function validateCommuneFields(
  codeDepartement?: string,
  codeCollectivite?: string,
  nomCollectivite?: string,
  taux1?: string,
  taux2?: string
) {
  const missingFields = [];

  if (!codeDepartement) missingFields.push("codeDepartement");
  if (!codeCollectivite) missingFields.push("codeCollectivite");
  if (!nomCollectivite) missingFields.push("nomCollectivite");

  if (missingFields.length > 0) {
    throw new Error(`Erreur : champs manquants pour la commune [${missingFields.join(", ")}]`);
  }

  if (!taux1 && !taux2) {
    throw new Error( `Erreur : les deux champs de taux sont vides pour la commune ` +
      `[${codeDepartement}-${codeCollectivite}-${nomCollectivite}]`);
  }
}

async function writeCsv(filePath: string, data: TaxeFonciereCommune[]) {
  console.log("Génération du nouveau CSV…");
  const newCsv = stringify(data, {
    columns: [
      "codeDepartement",
      "codeCollectivite",
      "nomCollectivite",
      "fbExonerationPartielleVlAnciensEconomesTaux",
      "fbNouvelleExonPartielleVlAnciensLogEconomesTaux",
      "codeInsee",
      "population",
      "taux",
    ],
  });
  await Deno.writeTextFile(filePath, newCsv);
}
