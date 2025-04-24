import React, { useEffect } from "react"
import { Layout } from '@components/common'
import {  Text } from '@components/ui'
import { Container } from '@components/GlobalComponents/Container'
import Breadcrumbs from '@components/breadcrumbs/Breadcrumbs'
import { Spacing } from "@components/GlobalComponents/Spacing"
import Savedbuild from "@components/SaveBuild";
import Head from 'next/head'
export default function SavedBuild(props) {
    console.log("props.result", props.result)
    return(
        <>  
            <Spacing>
            <Head>
                <title>Saved Build - Vektra Computers</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
                <Breadcrumbs breadcrumbs="My Saved Build" />
                <Container>
                    <Text variant="pageHeading">Saved Build</Text>
                    <Savedbuild 
                    builds={props?.result?props.result :[]}
                    length={props.builds.length}
                    />
                </Container>
            </Spacing>
        </>
    );
}
export async function getServerSideProps(context) {
    const { slug } = context.query;
    const CONFIGURATORAPIURL = process.env.NEXT_PUBLIC_API_URL+"/get-configurator-pc-data";
    let builds = [];
    let result=[];
    const saved_builds = (context.req.cookies.saved_builds)?context.req.cookies.saved_builds:null;
    let saved_builds_parse = [];
    if(saved_builds) {
        saved_builds_parse = JSON.parse(saved_builds)
    }
    if(saved_builds_parse.length > 0) {
        async function make_api_call(item){
            const conf_api_req = await fetch(CONFIGURATORAPIURL, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                enquiry_token: item.enquiry_token, 
                build_token:item.build_token 
                })
            });
        const conf_api_res = await conf_api_req.json()
        return conf_api_res
        }
        async function processBuilds(){
            let builds= [];
            let temp_data;
            for(let i = 0; i < saved_builds_parse.length; i++){
                temp_data = await make_api_call(saved_builds_parse[i]);
                builds.push(temp_data);
            }
            return builds;
        }
        result = await processBuilds();
      
        const conf_api_req = await fetch(CONFIGURATORAPIURL, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                enquiry_token: saved_builds_parse[0].enquiry_token, 
                build_token:saved_builds_parse[0].build_token 
            })
        });
        const conf_api_res = await conf_api_req.json()
        builds.push(conf_api_res);
        
    }
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
    return { props: { builds, result, saved_builds_parse,
        headerLinks,
        footerLinks, }}
}

SavedBuild.Layout = Layout