import React, { useEffect } from "react";
import { Layout } from '@components/common'
import LoginPage from "@components/User/User"
import Head from 'next/head'
export default function Register() {
    return(
        <React.Fragment>   
          <Head>
            <title>Register - Vektra Computers</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          </Head>
           <LoginPage />
        </React.Fragment>
    );
}

export async function getServerSideProps(context:any) {
    let token = (context.req.cookies.shopify_customerToken)?context.req.cookies.shopify_customerToken:null; 
    // if(token){
    //     return {
    //         redirect: {
    //           destination: '/myaccount',
    //           permanent: false,
    //         },
    //     }
    // }
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

Register.Layout = Layout