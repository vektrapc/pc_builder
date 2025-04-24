import type { GetStaticPropsContext } from 'next'
import useCustomer from '@framework/customer/use-customer'
import commerce from '@lib/api/commerce'
import { Layout } from '@components/common'
import {  Text } from '@components/ui'
import { Container } from "@components/GlobalComponents/Container"
import { Spacing } from "@components/GlobalComponents/Spacing"
import Breadcrumbs from '@components/breadcrumbs/Breadcrumbs'
import { ProfileStyle } from "@components/GlobalComponents/Profile"
import { Button2 } from "@components/GlobalComponents/Button"
import Link from "next/link"

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

export default function Profile() {
  const { data } = useCustomer()
  return (
    <Spacing>
      <Head>
            <title>My Profile - Vektra Computers</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          </Head>
      <Breadcrumbs  breadcrumbs="My Profile"/>
      <Container>

      <Text variant="pageHeading">My Profile</Text>
      <ProfileStyle>
        {data && (
          <div className="profileblog">
            <h2>Personal Details</h2>
            <div className="procontent mb-5">
              <div>
                <p>First Name</p>
                <span>
                  {data.firstName} 
                </span>
              </div>
              <div className="mt-5">
                <p>Last Name</p>
                <span>
                   {data.lastName}
                </span>
              </div>
              <div className="mt-5 lowercase">
                <p>Email</p>
                <span>{data.email}</span>
              </div>
              <div className="mt-5">
                <p>Phone</p>
                <span>{data.phone}</span>
              </div>
             
            </div>
             <Link href="/myaccount"><Button2>Back</Button2></Link>
          </div>
        )}
      </ProfileStyle>
      
      </Container>
    </Spacing>
    
  )
}

Profile.Layout = Layout
