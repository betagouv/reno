'use client'
import { Content, Wrapper } from '@/components/explications/ExplicationUI'
import useIsInIframe from "@/components/useIsInIframe"
import { HomeTestimonies } from "./LandingUI"
import { useState } from 'react'

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
            shortText: "Myriam est propriétaire de la petite maison dans laquelle elle vit avec ses deux enfants, près d’une grande ville et ne connaît pas le DPE actuel de sa maison.",
            moreText: " Dans le simulateur Mes Aides Réno, elle renseigne un revenu fiscal de 28 000 euros. Elle découvre qu’elle pourrait prétendre à des aides et même une avance pour la rénovation énergétique de son logement. Pour commencer, elle pense installer un chauffe-eau solaire (3 000 euros d’aides), et peut-être en profiter pour isoler les murs par l’extérieur (60 euros d’aides par m² isolé). Pour aller plus loin, elle prend contact avec la conseillère France Rénov proche de chez elle qui lui propose un rendez-vous d’une heure gratuit et indépendant."
        },
        {
            title: "Véronique, cherche à acheter un appartement pour de la location",
            shortText: "Véronique voudrait réaliser un investissement locatif dans une grande ville. Elle regarde du côté des appartements classés en passoire énergétique (DPE classe F ou G).",
            moreText: "Ces appartements sont proposés à des prix bien inférieurs au marché. Elle renseigne son revenu fiscal (41 000 euros) dans le simulateur Mes Aides Réno. Elle constate qu’elle pourrait bénéficier de 42 000 euros d’aides (dont une avance) pour faire une rénovation d’ampleur, et ainsi louer un logement plus confortable et économe. Surtout, elle est rassurée de découvrir qu’elle pourra bénéficier d’un accompagnement par un professionnel, en partie financé par les aides."
        },
        {
            title: "Linda et Jérémy, veulent rénover leur future longère",
            shortText: "Ce jeune couple souhaite quitter la ville pour s’installer à la campagne. Ils ont repéré une maison qui a un charme fou. Problème : elle a un DPE classé F, c’est une passoire thermique.",
            moreText: "Avec leur revenu fiscal de 71 000 euros l’année passée, ils pensaient n’être éligibles à aucune aide. Après avoir fait le test sur le simulateur Mes Aides Réno, ils constatent qu’ils peuvent prétendre à des aides de l’État importantes en cas d’une rénovation d’ampleur : 45 % du coût de leurs travaux avec un plafond de 70 000 euros de travaux. Dans leur cas, c’est donc 31 500 euros auxquels ils ont droit pour améliorer l’efficacité énergétique de leur future maison, dont une partie peut être versée en avance. Ils ont aussi droit à un accompagnement par un professionnel, en partie financé par les aides. Le DPE de leur maison passerait ainsi de la classe F à la classe B."
        },
        {
            title: "Mylène, Mehdi et leur jeune enfant, viennent d’acheter l’appartement qu’ils louent actuellement",
            shortText: "Mylène, Mehdi et leur fille louent un bel appartement ancien dans le centre d’une grande ville, qu’ils ont pu acheter.",
            moreText: " Leur logement a un DPE classe D, et ils aimeraient profiter de leur achat pour en améliorer le confort d’été et diminuer leurs factures d’électricité. Avec leur revenu fiscal de 37 000 euros l’année dernière, le simulateur Mes Aides Réno leur indique que 60% du montant des travaux de rénovation énergétique d’ampleur peut être pris en charge par l’État, dans la limite de 40 000 euros de travaux. Cela signifie que sur 40 000 euros de travaux, ils pourront bénéficier de 24 000 euros d’aides. Ils décident de prendre contact avec l’espace France Rénov’ le plus proche de chez eux, dont les coordonnées sont indiquées à la fin de la simulation."
        }
    ];

    return !isInIFrame && (
    <Wrapper $background="white" $noMargin={true} $last={true}>
        <Content>
            <h2 css={`text-align: center; margin-top: 0;`}>Histoires d’usagers</h2>
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
                                <span className="see-more-click">
                                    {expanded[index] ? "Voir moins" : "Voir plus"}
                                </span>
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

