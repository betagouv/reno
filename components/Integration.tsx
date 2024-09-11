"use client";
import { HeaderWrapper, BlueEm } from "@/app/LandingUI";
import Link from "next/link";
import Image from "next/image";
import rules from '@/app/règles/rules';
import css from '@/components/css/convertToJs';
import illustrationAccueil from '@/public/illustration-accueil.resized.jpg';
import { Content, Wrapper } from '@/components/explications/ExplicationUI';
import getAppUrl from "./getAppUrl";
import { PageBlock, Intro, CTAWrapper, CTA } from "./UI";
import { useState } from "react";
import { Select } from "./InputUI";

export default function Integration() {
  const [module, setModule] = useState("/");
  const listeModule = [
    {
      titre: "Module Principal",
      valeur: "/"
    },
    {
      titre: "Module Copropriété",
      valeur: "/copropriete"
    }
  ];

  Object.keys(rules)
    .filter((item) => item.startsWith('gestes') && item.endsWith('MPR'))
    .forEach((item) => listeModule.push({
      titre: "Module MaPrimeRénov - "+rules[item.replace(" . MPR", '')].titre,
      valeur: "/aides/ma-prime-renov/"+encodeURIComponent(rules[item.replace(" . MPR", '')].titre)
    }))
  Object.keys(rules)
    .filter((item) => item.startsWith('gestes') && item.endsWith('CEE'))
    .forEach((item) => listeModule.push({
      titre: "Module CEE - "+rules[item.replace(" . CEE", '')].titre,
      valeur: "/aides/cee/"+rules[item].code+"/"+encodeURIComponent(rules[item.replace(" . CEE", '')].titre)
    }))
  Object.keys(rules)
    .filter((item) => item.startsWith('gestes') && item.endsWith('Coup de pouce'))
    .forEach((item) => listeModule.push({
      titre: "Module Coup de Pouce - "+rules[item.replace(" . Coup de pouce", '')].titre,
      valeur: "/aides/coup-de-pouce/"+encodeURIComponent(rules[item.replace(" . Coup de pouce", '')].titre)
    }))

  const iframeCode = `<iframe src="${getAppUrl() + module}" style="width: 400px; height: 700px; margin: 3rem auto; display: block; border: 0.2rem solid black; border-radius: 1rem;"></iframe>`;

  return (
    <PageBlock>
      <HeaderWrapper>
        <Image
          src={illustrationAccueil}
          alt="Des ouvriers peignent et réparent la facade d'une maison"
        />
        <div>
          <h1
            style={css`
              margin-top: 0.6rem;
              margin-bottom: 1rem;
            `}
          >
            <BlueEm>Intégrer</BlueEm> le calculateur des aides à la rénovation
            sur <BlueEm>votre site</BlueEm>.
          </h1>
          <Intro>
            <p>
              Mes Aides Réno est un service public de calcul des aides à la
              rénovation énergétique. Le sujet est complexe, les aides sont
              multiples, les règles sont mouvantes.
            </p>
            <p>
              En intégrant directement notre calculateur sous forme d'iframe
              chez vous, vous permettez à vos utilisateurs de calculer leurs
              aides sans qu'ils quittent votre site.
            </p>
          </Intro>
        </div>
      </HeaderWrapper>
      <Wrapper>
        <Content>
          <h2 css={`margin-bottom: 1rem;`}>Choisissez le module à intégrer:</h2>
          <Select
              onChange={(e) => setModule(e.target.value)}
              value={module}
            >
              {listeModule.map((item, index) => (
                <option
                  key={index}
                  value={item.valeur}
                >
                  {item.titre}
                </option>
              ))}
            </Select>
          <p css={`margin-top: 1rem;`}>
            Voici{' '}
            <BlueEm>
              <strong>le code à intégrer</strong>
            </BlueEm>{' '}
            dans votre HTML ou votre contenu Wordpress :
          </p>
          <code>
            {iframeCode}
          </code>
          <h2>Le résultat</h2>

          <div
            style={css`
              text-align: center;
              background: radial-gradient(
                circle,
                rgba(0, 0, 145, 0.2) 0%,
                rgba(0, 212, 255, 0) 60%,
                rgba(0, 212, 255, 0) 100%
              );
            `}
          >
            <p>[votre contenu]</p>
            <iframe
              src={getAppUrl() + module}
              style={css`
                width: 400px;
                height: 700px;
                margin: 3rem auto;
                display: block;
                border: 0.2rem solid black;
                border-radius: 1rem;
                box-shadow:
                  rgba(0, 0, 0, 0.1) 0px 20px 25px -5px,
                  rgba(0, 0, 0, 0.04) 0px 10px 10px -5px;
              `}
            ></iframe>
            <p>[la suite de votre contenu]</p>
          </div>
        </Content>
      </Wrapper>
      <Wrapper $background="white" $noMargin={true} $last={true}>
        <Content>
          <h2>Calcul de MaPrimeRénov'</h2>
          <p>
            MaPrimeRénov', parcours par geste et parcours accompagné, CEE, CEE
            coup de pouce, aides locales, prêt à taux zéro, dispositif
            Denormandie, exonérations fiscales, aides à la copropriété, etc :
            le monde des aides à la rénovation est complexe.
          </p>
          <p>
            Depuis début 2024, l'État propose <BlueEm>Mes Aides Réno</BlueEm>,
            un calculateur ouvert et en développement actif qui intégrera
            toutes ces aides dans une interface de simulation simple destinée
            au grand public.
          </p>
          <h2>Toujours à jour</h2>
          <p>
            Pour l'instant, l'accent est mis sur le dispositif principal,
            MaPrimeRénov'.
          </p>
          <p>
            En intégrant dès maintenant le calculateur sur votre site, vous
            profiterez automatiquement des mises à jour qui auront lieu très
            prochainement pendant l'été et à la rentrée 2024 et ajouteront
            progressivement toutes les aides à la rénovation énergétique.
          </p>
        </Content>
      </Wrapper>
      <Wrapper $noMargin={true} $last={true}>
        <Content>
          <h2>Un besoin particulier ? Un retour ? Contactez-nous</h2>
          <p>
            Nous sommes à l'écoute de vos besoins, que vous soyez une
            administration publique, une collectivité, une entreprise (banque,
            courtier, agence immobilière, etc.) ou un professionnel du secteur
            (conseiller France Rénov', Mon Accompagnateur Rénov, ADIL, etc).
          </p>
          <p>
            Nouvelles fonctionnalités, personnalisation de l'intégration,
            partenariat spécifique : discutons de vos besoins.
          </p>
          <p>
            Découvrez aussi{' '}
            <Link href="/api-doc">
              notre API de calcul des aides à la rénovation
            </Link>
            .
          </p>
          <CTAWrapper $justify="center">
            <CTA $fontSize="normal">
              <Link href="mailto:contact@mesaidesreno.fr">
                ✉️ Nous contacter
              </Link>
            </CTA>
          </CTAWrapper>
        </Content>
      </Wrapper>
    </PageBlock>
  );
}
