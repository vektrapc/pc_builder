import type {
  GetStaticPathsContext,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from 'next'
import Head from 'next/head'
import commerce from '@lib/api/commerce'
import { Text } from '@components/ui'
import { Layout } from '@components/common'
import getSlug from '@lib/get-slug'
import { missingLocaleInPages } from '@lib/usage-warns'
import type { Page } from '@commerce/types/page'
import { useRouter } from 'next/router'
import {Container} from 'components/GlobalComponents/Container'
import Breadcrumbs from '@components/breadcrumbs/Breadcrumbs'
import { Spacing } from '@components/GlobalComponents/Spacing'

export async function getStaticProps({
  preview,
  params,
  locale,
  locales,
}: GetStaticPropsContext<{ pages: string[] }>) {
  const config = { locale, locales }
  const pagesPromise = commerce.getAllPages({ config, preview })
  const siteInfoPromise = commerce.getSiteInfo({ config, preview })
  const { pages } = await pagesPromise
  const { categories } = await siteInfoPromise
  const path = params?.pages.join('/')
  const slug = locale ? `${locale}/${path}` : path
  const pageItem = pages.find((p: Page) =>
    p.url ? getSlug(p.url) === slug : false
  )
  const data =
    pageItem &&
    (await commerce.getPage({
      variables: { id: pageItem.id! },
      config,
      preview,
    }))

  const page = data?.page

  if (!page) {
    // We throw to make sure this fails at build time as this is never expected to happen
    throw new Error(`Page with slug '${slug}' not found`)
   
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
    props: { pages, page, categories,headerLinks,
      footerLinks, },
    revalidate: 60 * 60, // Every hour
  }
}

export async function getStaticPaths({ locales }: GetStaticPathsContext) {
  const config = { locales }
  const { pages }: { pages: Page[] } = await commerce.getAllPages({ config })
  const [invalidPaths, log] = missingLocaleInPages()
  const paths = pages
    .map((page) => page.url)
    .filter((url) => {
      if (!url || !locales) return url
      // If there are locales, only include the pages that include one of the available locales
      if (locales.includes(getSlug(url).split('/')[0])) return url

      invalidPaths.push(url)
    })
  log()

  return {
    paths,
    fallback: 'blocking',
    
  }
}

export default function Pages({
  page,
  pages
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();
 return router.isFallback ? (
    <h1>Loading...</h1> // TODO (BC) Add Skeleton Views
  ) : (
      <>       
      <Head>
            <title>{page.seo.title}</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          </Head>
          <Head>
            <title>{page.seo.title}</title>
            <meta name="description" content={page.seo.description} />
            <meta name="og:title" content={page.seo.title} />
            <meta name="og:description" content={page.seo.description} />
          </Head>  
      <Breadcrumbs breadcrumbs={page.name} />
      <Spacing>
      <Container className="">
        <div className="max-w-6xl sm:mx-auto  text-secondary customcss">
          {page?.body && <Text html={page.body} />
          }
        </div>        
      </Container>
      </Spacing>
   
      </>
  )
}

Pages.Layout = Layout
