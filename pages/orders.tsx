import type { GetStaticPropsContext } from 'next';
import useCustomer from '@framework/customer/use-customer'
import commerce from '@lib/api/commerce'
import { Bag } from '@components/icons'
import { Layout } from '@components/common'
import {  Text } from '@components/ui'
import { Container } from '@components/GlobalComponents/Container'
import Breadcrumbs from '@components/breadcrumbs/Breadcrumbs'
import { Spacing } from "@components/GlobalComponents/Spacing";
import OrderItem from "../components/orderItem";
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

export default function Orders() {
  const { data } = useCustomer();
  const orders  = data?.orders?.edges
  return (
    <>
      <Head>
            <title>Orders - Vektra Computers</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          </Head>
    <Spacing>
       <Breadcrumbs breadcrumbs="Orders"/>
      <Container>
        <Text variant="pageHeading">My Orders</Text>
        {
          orders?.length > 0 ?
          <OrderItem
          orders={orders}
          />
          :

          <div className="flex-1 px-12 py-24 flex flex-col justify-center items-center bg-black bg-opacity-50 ">
          <span >
            <Bag className="w-20 h-20" />
          </span>
          <h2 className="pt-6 text-2xl font-bold tracking-wide text-center">
            No orders found
          </h2>
          {/* <p className="text-accent-6 px-10 text-center pt-2">
            Biscuit oat cake wafer icing ice cream tiramisu pudding cupcake.
          </p> */}
        </div>
        }
      </Container>
    </Spacing>
    </>
  )
}

Orders.Layout = Layout
