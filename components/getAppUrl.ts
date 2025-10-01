export default function getAppUrl() {
  if (process.env.NEXT_PUBLIC_DEPLOY_DOMAIN)
    return 'https://' + process.env.NEXT_PUBLIC_DEPLOY_DOMAIN

  const branchUrl = process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL,
    isMaster = branchUrl?.includes('-git-master-'),
    domain = isMaster ? 'mesaidesreno.beta.gouv.fr' : branchUrl

  const urlBase =
    process.env.NEXT_PUBLIC_NODE_ENV === 'development'
      ? 'http://localhost:8080'
      : 'https://' + domain
  return urlBase
}
export function getServerUrl() {
  const urlBase =
    process.env.NEXT_PUBLIC_NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : `https://mardata.osc-fr1.scalingo.io`
  return urlBase
}
