import React from 'react'
import { Layout } from '@components/common'
import Configurator from '@components/Configurator/Configurator';
import Head from 'next/head'
export async function getStaticProps() {
  const homereq = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/homepage/`)
  const homedata = await homereq.json();
  let headerLinks;
  let footerLinks;
  try {
    const requestOptions = {
      method: 'GET',
  };
    const req =  await fetch('https://vektra-pc.myshopify.com/pages/menus-api/store-front-main-menu', requestOptions)
    const req2 =  await fetch('https://vektra-pc.myshopify.com/pages/menus-api/store-front-footer-menu', requestOptions)
    const req_json = await req.json();
    const req_json2 = await req2.json();
    headerLinks = req_json["store-front-main-menu"]
    footerLinks = req_json2["store-front-footer-menu"]
  }catch(error) {

  }
  return {
    props: {
      homedata,
      headerLinks,
      footerLinks,
    },
    revalidate: 60,
  }
}
export default function Config({ homedata }) {
  return (
    <React.Fragment>
      <Head>
        <title>Configurator - Vektra Computers</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          </Head>
      <Configurator data={homedata} />
    </React.Fragment>
  )
}
Config.Layout = Layout
