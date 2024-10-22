'use client'

export default function () {
  return (
    <section>
      <div
        id="widgetIframe"
        css={`
          iframe {
            height: 900px;
          }
        `}
      >
        <iframe
          width="100%"
          height="100%"
          src="https://stats.beta.gouv.fr/index.php?module=Widgetize&action=iframe&containerId=VisitOverviewWithGraph&disableLink=1&widget=1&moduleToWidgetize=CoreHome&actionToWidgetize=renderWidgetContainer&idSite=101&period=day&date=yesterday"
          scrolling="yes"
          frameborder="0"
          marginheight="0"
          marginwidth="0"
        ></iframe>
      </div>
    </section>
  )
}
