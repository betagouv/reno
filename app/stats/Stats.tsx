'use client'

export default function () {
  return (
    <section
      css={`
        > div {
          margin: 1rem 0;
        }
      `}
    >
      <div id="widgetIframe">
        <iframe
          width="100%"
          height="246px"
          src="https://stats.beta.gouv.fr/index.php?forceView=1&viewDataTable=graphEvolution&module=Widgetize&action=iframe&disableLink=1&widget=1&moduleToWidgetize=VisitsSummary&actionToWidgetize=getEvolutionGraph&idSite=101&period=day&date=yesterday"
          scrolling="yes"
          frameborder="0"
          marginheight="0"
          marginwidth="0"
        ></iframe>
      </div>
      <div id="widgetIframe">
        <iframe
          width="100%"
          height="436px"
          src="https://stats.beta.gouv.fr/index.php?forceView=1&viewDataTable=sparklines&module=Widgetize&action=iframe&disableLink=1&widget=1&moduleToWidgetize=VisitsSummary&actionToWidgetize=get&idSite=101&period=day&date=yesterday"
          scrolling="yes"
          frameborder="0"
          marginheight="0"
          marginwidth="0"
        ></iframe>
      </div>
    </section>
  )
}
