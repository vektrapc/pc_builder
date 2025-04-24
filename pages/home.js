import React from 'react'
import { Layout } from '@components/common'

import HomePage from '@components/Homepage/Home'
export async function getStaticProps() {
  const homereq = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/homepage/`)
  const homedata = await homereq.json()
  return {
    props: {
      homedata,
    },
    revalidate: 60,
  }
}
export default function Home({ homedata }) {
  return (
    <React.Fragment>
      <HomePage homedata={homedata} />
      {/* <div id="trustbox" className="trustpilot-widget" data-locale="en-GB" data-template-id="XX" data-businessunit-id="XX" data-style-height="130px" data-style-width="100%" data-theme="light" data-stars="5" data-schema-type="Organization">
          <a href="https://uk.trustpilot.com/review/vektrapc.com" target="_blank">Trustpilot</a>
      </div> */}
    </React.Fragment>
  )
}

Home.Layout = Layout
