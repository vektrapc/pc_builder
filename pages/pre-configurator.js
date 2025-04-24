import React from 'react'
import Layout from '@components/Layout'
import Breadcrumbs from '@components/breadcrumbs/Breadcrumbs'
import Preconfig from '@components/PreConfigurator/PreConfigurator'

export default function Preconfigs() {
  return (
    <React.Fragment>
      <Layout title="Pre-configured PCs">
        <Breadcrumbs breadcrumbs="Pre-configured PCs" />
        <Preconfig />
      </Layout>
    </React.Fragment>
  )
}
