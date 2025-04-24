import commerce from '@lib/api/commerce'
import { Layout } from '@components/common'
import { ProductCard } from '@components/product'
import { Grid, Marquee, Hero } from '@components/ui'
import HomePage from '@components/Homepage/Home';
import TrustPilotWidget from "../components/TrustPilotWidget"
import { Fragment, useEffect } from 'react';
import Head from 'next/head'
import {SiTrustpilot} from "react-icons/si"

// import HomeAllProductsGrid from '@components/common/HomeAllProductsGrid'
//import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next'

export async function getStaticProps({ preview, locale, locales }) {
  const config = { locale, locales }
  const productsPromise = commerce.getAllProducts({
    variables: { first: 6 },
    config,
    preview,
    // Saleor provider only
    ...{ featured: true },
  })
  const pagesPromise = commerce.getAllPages({ config, preview })
  const siteInfoPromise = commerce.getSiteInfo({ config, preview })
  const { products } = await productsPromise
  const { pages } = await pagesPromise
  const { categories, brands } = await siteInfoPromise
  let generalSettings= null;
  //fetch banners
  let headerLinks;
  let footerLinks;
  try {
    const requestOptions = {
      method: 'GET',
  };
    const req =  await fetch('https://vektra-pc.myshopify.com/pages/menus-api/store-front-main-menu', requestOptions)
    const req2 =  await fetch('https://vektra-pc.myshopify.com/pages/menus-api/store-front-footer-menu', requestOptions)
    const GENERALSETTINGSENDPOINT = process.env.NEXT_PUBLIC_API_URL+"/general-settings";
   
    try {
      const req = await fetch(GENERALSETTINGSENDPOINT, {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: "",
          });
          const res = await req.json();
          if(res.data) {
            generalSettings = res.data
          }
  } catch (error) {
    console.log(error)
  }
    const req_json = await req.json();
    const req_json2 = await req2.json();
    headerLinks = req_json["store-front-main-menu"]
    footerLinks = req_json2["store-front-footer-menu"]
  }catch(error) {

  }
  const homereq = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/homepage/`)
  const homedata = await homereq.json()
  return {
    props: {
      products,
      categories,
      brands,
      pages,
      homedata,
      headerLinks,
      footerLinks,
      generalSettings
    },
    revalidate: 60,
  }
}
export default function Home({ products, homedata,headerLinks,footerLinks, generalSettings }) {
 console.log("headerLinksheaderLinks", generalSettings);
 useEffect(() => {
  var aScript = document.createElement('script');
  aScript.type = 'text/javascript';
  aScript.src = "//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js";
  aScript.async = "true"
  document.head.appendChild(aScript);
  aScript.onload = function () {
      var trustbox = document.getElementById('trustbox');
      window.Trustpilot.loadFromElement(trustbox);
  };
 }, [])
 const {meta_title, meta_desc, meta_key} = generalSettings
  return (
    <Fragment>
      <Head>
            <title>{meta_title.value}</title>
            <meta name="description" content={meta_desc.value} />
            <meta name="keywords" content={meta_key.value} />
            <meta name="og:title" content={meta_title.value} />
            <meta name="og:description" content={meta_desc.value} />
      </Head>  
      {/* <Grid variant="filled">
        {products.slice(0, 3).map((product, i) => (
          <ProductCard
            key={product.id}
            product={product}
            imgProps={{
              width: i === 0 ? 1080 : 540,
              height: i === 0 ? 1080 : 540,
            }}
          />
        ))}
      </Grid>
      <Marquee variant="secondary">
        {products.slice(0, 3).map((product, i) => (
          <ProductCard key={product.id} product={product} variant="slim" />
        ))}
      </Marquee>
      <Hero
        headline=" Dessert dragée halvah croissant."
        description="Cupcake ipsum dolor sit amet lemon drops pastry cotton candy. Sweet carrot cake macaroon bonbon croissant fruitcake jujubes macaroon oat cake. Soufflé bonbon caramels jelly beans. Tiramisu sweet roll cheesecake pie carrot cake. "
      />
      <Grid layout="B" variant="filled">
        {products.slice(0, 3).map((product, i) => (
          <ProductCard
            key={product.id}
            product={product}
            imgProps={{
              width: i === 0 ? 1080 : 540,
              height: i === 0 ? 1080 : 540,
            }}
          />
        ))}
      </Grid>
      <Marquee>
        {products.slice(3).map((product, i) => (
          <ProductCard key={product.id} product={product} variant="slim" />
        ))}
      </Marquee> */}
      <HomePage 
      headerLinks={headerLinks}
      footerLinks={footerLinks}
      homedata={homedata}
       />
       {/* <div id="trustbox" className="trustpilot-widget" data-locale="en-GB" data-template-id="XX" data-businessunit-id="XX" data-style-height="130px" data-style-width="100%" data-theme="light" data-stars="5" data-schema-type="Organization">
          <a href="https://uk.trustpilot.com/review/vektrapc.com" >Trustpilot</a>
      </div> */}
      {/* <TrustPilotWidget />
      <button className="reviewbtn">Review us on <SiTrustpilot className="icons" />Trustpilot</button> */}
    </Fragment>
  )
}

Home.Layout = Layout
