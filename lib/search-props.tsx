import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next'

import commerce from '@lib/api/commerce'

export async function getSearchStaticProps({
  preview,
  locale,
  locales,
  params,
}: GetStaticPropsContext) {
  const config = { locale, locales }
  const pagesPromise = commerce.getAllPages({ config, preview })
  const siteInfoPromise = commerce.getSiteInfo({ config, preview })
  const { pages } = await pagesPromise
  const { categories, brands } = await siteInfoPromise
  const c = params?.category
  const activeCategory = categories.find((cat: any) => cat.slug === c)
  let result
  if(activeCategory) {
    const collectionPromise = commerce.getAllProductsFromCollection({
      variables: {
        categoryId: activeCategory?.id,
        search: '',
        sort:'',
        locale:'',
        first: 12,
      },
      config,
      preview,
    })
    result = await collectionPromise
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
      pages,
      categories,
      brands,
      seo:result?.seo? result?.seo:{},
      headerLinks,
        footerLinks,
    },
    revalidate: 200,
  }
}

export type SearchPropsType = InferGetStaticPropsType<
  typeof getSearchStaticProps
>

