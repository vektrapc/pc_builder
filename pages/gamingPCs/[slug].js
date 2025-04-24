import React from "react";
import { Fragment } from "react";
import ReviewBuilds from "@components/pc_s/pcs_process/ReviewBuild/Reviews"
import BreadCrumb from "@components/breadcrumbs/Breadcrumbs"
import CasePC_s from "@components/pc_s/CasePC_s"
import { Layout } from '@components/common'
import { Spacing } from "@components/GlobalComponents/Spacing";
import Head from 'next/head';
import { useRouter } from 'next/router'
export async function getServerSideProps(context) {
    const { slug } = context.query;
    const configuration_token = (context.req.cookies.configuration_token)?context.req.cookies.configuration_token:null;
    const build_token = (context.req.cookies.build_token)?context.req.cookies.build_token:null;
    if(!configuration_token) { 
        return {
            redirect: {
                destination: '/configurator',
                permanent: false,
            },
        }
    }
    
    const CONFIGURATORAPIURL = process.env.NEXT_PUBLIC_API_URL+"/get-configurator-pc-data";
    const conf_api_req = await fetch(CONFIGURATORAPIURL, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enquiry_token: configuration_token, product_type: slug, build_token:build_token })
    });
    const conf_api_res = await conf_api_req.json();
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
    return { props: { 
        slug,
        conf_api_res,
        headerLinks,
        footerLinks,
    }}
}

export default function Gaming({slug,conf_api_res}) {
    const router = useRouter()
    function capitalize(input = "") {  
        const mySentence = input.replace(/[^a-zA-Z0-9]/g, " ");
        const words = mySentence.split(" ");
      
        for (let i = 0; i < words.length; i++) {
            console.log("words[i]", words[i])
            if(isNaN(words[i])   ) {
                words[i] = words[i][0].toUpperCase() + words[i].substr(1);
            } else {
                words[i] = words[i][0]
            }
        }
        return words.join(' ');  
      } 
    if(slug == "review-build"){
        return(
            <Fragment>
                <Head>
                    <title>{capitalize(slug)} - Vektra Computers</title>
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                </Head>
                <Spacing>
                    <BreadCrumb breadcrumbs="Gaming PC Configurator"/>
                    <ReviewBuilds slug={slug} conf_api_res={conf_api_res} />
                </Spacing>
            </Fragment>
        );
    }
    else{
        return(
            <React.Fragment>
                <Head>
                    <title>{capitalize(slug)} - Vektra Computers</title>
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                </Head>
                <Spacing>
                    <BreadCrumb breadcrumbs="Gaming PC Configurator"/>
                    <CasePC_s slug={slug} conf_api_res={conf_api_res}/>
                </Spacing>
            </React.Fragment>
        );
    }
}

Gaming.Layout = Layout
