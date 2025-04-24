import React from "react";
import { Layout } from '@components/common'
import MyAccount from "@components/Myaccount";
import Head from 'next/head'


export default function MyAccountDetails() {
    return(
        <React.Fragment>   
          <Head>
            <title>My Account - Vektra Computers</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          </Head>
           <MyAccount />
        </React.Fragment>
    );
}

export async function getServerSideProps(context:any) {
    let token = (context.req.cookies.shopify_customerToken)?context.req.cookies.shopify_customerToken:null; 
    if(!token){
        return {
            redirect: {
              destination: '/login',
              permanent: false,
            },
        }
    }
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
       
        headerLinks,
        footerLinks,
       },
    }
}

MyAccountDetails.Layout = Layout