'use client'
import { Content, Key, Wrapper } from '@/components/explications/ExplicationUI'
import useIsInIframe from "@/components/useIsInIframe"
import { HomeTestimonies } from "./LandingUI"
import { useState } from 'react'
import DPELabel from '@/components/DPELabel'
import { CTA } from '@/components/UI'

export default function HomepageSteps() {
    const isInIFrame = useIsInIframe()
    const [expanded, setExpanded] = useState({});

    const toggleExpand = (index) => {
        setExpanded(prevState => ({
            ...prevState,
            [index]: !prevState[index]
        }));
    };
    
    const testimonials = [
        {
            title: "Myriam, veut rénover sa résidence principale",
            shortText: "Myriam est propriétaire de la petite maison dans laquelle elle vit avec ses deux enfants, près d'une grande ville et ne connaît pas le DPE actuel de sa maison.",
            moreText: <>Dans le simulateur Mes Aides Réno, elle renseigne un revenu fiscal de <Key $state={'final'}>28 000 €</Key>. Elle découvre qu'elle pourrait prétendre à des aides et même <strong>une avance pour la rénovation énergétique</strong> de son logement. Pour commencer, elle pense installer un chauffe-eau solaire (<Key $state={'prime'}>3 000 €</Key>  d'aides), et peut-être en profiter pour isoler les murs par l'extérieur (<Key $state={'prime'}>60 euros/m² isolé</Key> d'aides). Pour aller plus loin, elle prend contact avec la conseillère France Rénov proche de chez elle qui lui propose un <strong>rendez-vous d'une heure gratuit</strong> et indépendant.</>
        },
        {
            title: "Véronique, cherche à acheter un appartement pour de la location",
            shortText: <>Véronique voudrait réaliser un investissement locatif dans une grande ville. Elle regarde du côté des appartements classés en passoire énergétique (DPE <DPELabel index="5" /> ou <DPELabel index="6" />).</>,
            moreText: <>Ces appartements sont proposés à des prix bien inférieurs au marché. Elle renseigne son revenu fiscal (<Key $state={'final'}>41 000 €</Key>) dans le simulateur Mes Aides Réno. Elle constate qu'elle pourrait bénéficier de <Key $state={'prime'}>42 000 €</Key> d'aides (dont une avance) pour faire une rénovation d'ampleur, et ainsi louer un logement plus confortable et économe. Surtout, elle est rassurée de découvrir qu'elle pourra <strong>bénéficier d'un accompagnement par un professionnel</strong>, en partie financé par les aides.</>
        },
        {
            title: "Linda et Jérémy, veulent rénover leur future longère",
            shortText: <>Ce jeune couple souhaite quitter la ville pour s'installer à la campagne. Ils ont repéré une maison qui a un charme fou. Problème : elle a un DPE classé <DPELabel index="5" />, c'est une passoire thermique.</>,
            moreText: <>Avec leur revenu fiscal de <Key $state={'final'}>71 000 €</Key>, ils pensaient n'être éligibles à aucune aide. Après avoir fait le test sur le simulateur Mes Aides Réno, ils constatent qu'ils peuvent prétendre à des aides de l'État importantes : <Key $state={`prime`}>45 % du coût des travaux</Key> en cas d'une rénovation d'ampleur avec un plafond de <Key $state={`final`}>70 000 €</Key> de travaux. C'est donc <Key $state={`prime`}>31 500 €</Key> auxquels ils ont droit pour améliorer l'efficacité énergétique de leur future maison, dont <strong>une partie peut être versée en avance</strong>. Ils ont aussi droit à un accompagnement par un professionnel, en partie financé par les aides. Le DPE de leur maison passerait ainsi de la classe <DPELabel index="5" /> à la classe <DPELabel index="1" />.</>
        },
        {
            title: "Mylène, Mehdi et leur jeune enfant, viennent d'acheter l'appartement qu'ils louent actuellement",
            shortText: "Mylène, Mehdi et leur fille louent un bel appartement ancien dans le centre d'une grande ville, qu'ils ont pu acheter.",
            moreText: <>Leur logement a un DPE classe <DPELabel index="4" />, et ils aimeraient profiter de leur achat pour en améliorer le confort d'été et <strong>diminuer leurs factures d'électricité</strong>. Avec leur revenu fiscal de <Key $state={`final`}>37 000 €</Key> l'année dernière, le simulateur Mes Aides Réno leur indique que <Key $state={`prime`}>60% du coût des travaux</Key> de rénovation énergétique d'ampleur peut être pris en charge par l'État, dans la limite de <Key $state={`final`}>40 000 €</Key> de travaux. Cela signifie qu'ils pourront bénéficier de <Key $state={`prime`}>24 000 €</Key> d'aides. Ils décident de <strong>prendre contact avec l'espace France Rénov' le plus proche</strong> de chez eux, dont les coordonnées sont indiquées à la fin de la simulation.</>
        }
    ];

    return !isInIFrame && (
    <Wrapper $background="white" $noMargin={true} $last={true}>
        <Content>
            <h2 css={`text-align: center; margin-top: 0;`}>Histoires d'usagers</h2>
            <HomeTestimonies>
                {testimonials.map((testimonial, index) => (
                    <div key={index} className="fr-quote">
                        <h3>{testimonial.title}</h3>
                        <details>
                            <summary
                             onClick={() => toggleExpand(index)}
                             css={`
                                outline: none;
                                list-style: none;
                                text-align: justify;
                                &::-webkit-details-marker {
                                    display: none;
                                }
                                &::marker {
                                    display: none;
                                }`}>
                                <span>{testimonial.shortText}</span>
                                <div css={`display: flex;justify-content: flex-end;`}>
                                    <CTA
                                        $fontSize="normal"
                                        $importance="secondary"
                                        className="see-more-click"
                                        >
                                        Voir ses aides €
                                    </CTA>
                                </div>
                            </summary>
                            <p className="see-more">
                                {testimonial.moreText}
                            </p>
                        </details>
                    </div>
                ))}
            </HomeTestimonies>
        </Content>
    </Wrapper>
    )
}

