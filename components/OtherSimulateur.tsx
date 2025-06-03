'use client'
import { Card } from './UI'
import logoMPR from '@/public/maprimerenov-logo.svg'
import logoCEE from '@/public/cee.svg'
import Image from 'next/image'
import styled from 'styled-components'

export default function OtherSimulateur({mprAssocie = [], ceeAssocie}) {
    return (
        <>
            <h3>Ce n'est pas tout ! Simulez également :</h3>
            <div css={`display:flex;justify-content:space-around;flex-direction: row;flex-wrap: wrap;overflow: hidden;`}>
                <CardLink>
                    <LinkSimulateur href="/simulation">
                        <span css={`font-size: 4rem; color: var(--color);height: 100%;align-content: center;`}>€</span>
                        L'ensemble de vos aides
                    </LinkSimulateur>
                </CardLink>
                { mprAssocie && mprAssocie.map((mpr) => (
                    <CardLink key={mpr} css={`&:hover { background: #e8edff; }`}>
                        <LinkSimulateur href={`/aides/ma-prime-renov/${encodeURIComponent(mpr)}`}>
                            <Image src={logoMPR} alt="Logo MaPrimeRénov" width="200" css={`margin: 1rem 0 !important;`} />
                            Aides MaPrimeRénov' pour<br /> 
                            <strong>{mpr}</strong> 
                        </LinkSimulateur>
                    </CardLink>
                ))}
                { ceeAssocie && (
                    <CardLink css={`&:hover { background: #e8edff; }`}>
                        <LinkSimulateur href={`/aides/cee/${ceeAssocie.code}/${encodeURIComponent(ceeAssocie.titre)}`}>
                            <Image src={logoCEE} alt="Logo MaPrimeRénov" width="100" />
                            Aides CEE pour<br /> 
                            <strong>{ceeAssocie.titre}</strong> 
                        </LinkSimulateur>
                    </CardLink>
                )}
            </div>
        </>
    )
}
export const CardLink=styled(Card)`
    &:hover { background: #e8edff; }
`
export const LinkSimulateur=styled.a`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-decoration:none;
    color: black;
    height: 100%;
    justify-content: space-between;
    text-align: center;
    img {
    margin-bottom: 0.5rem;
    }
`

