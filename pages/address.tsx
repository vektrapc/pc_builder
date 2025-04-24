import React from "react";
import { Layout } from '@components/common'
import {  Text } from '@components/ui'
import { Container } from '@components/GlobalComponents/Container'
import Breadcrumbs from '@components/breadcrumbs/Breadcrumbs'
import { Spacing } from "@components/GlobalComponents/Spacing"
import type { GetStaticPropsContext } from 'next'
import Addresspage from  "@components/Address"
import commerce from '@lib/api/commerce';
import Head from 'next/head'
export async function getStaticProps({
    preview,
    locale,
    locales,
  }: GetStaticPropsContext) {
    const config = { locale, locales }
    const pagesPromise = commerce.getAllPages({ config, preview })
    const siteInfoPromise = commerce.getSiteInfo({ config, preview })
    const { pages } = await pagesPromise
    const { categories } = await siteInfoPromise
  
    //fetch banners
    let headerLinks:any;
    let footerLinks:any;
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
        pages, 
        categories,
        headerLinks,
        footerLinks,
       },
    }
  }
export default function Address() {
    return(
        <React.Fragment> 
          <Head>
            <title>Addresses - Vektra Computers</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          </Head>  
            <Spacing>
                <Breadcrumbs breadcrumbs="My Address Book" />
                <Container>
                    <Text variant="pageHeading">My Address Book</Text>
                   
                   <Addresspage />
                </Container>
            </Spacing>
        </React.Fragment>
    );
}


Address.Layout = Layout