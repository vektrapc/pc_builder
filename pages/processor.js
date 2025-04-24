import React from "react";
import Layout from "@components/Layout";
import Breadcrumbs from "@components/breadcrumbs/Breadcrumbs";
import Processor from "@components/Processor/Processor"
export default function Processors() {
    return(
        <Layout title="Processor">
            <Breadcrumbs breadcrumbs="Processor"/>
            <Processor />
        </Layout>
    );
}