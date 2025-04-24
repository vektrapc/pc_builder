import type {
  GetStaticPathsContext,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from 'next'
import { useRouter } from 'next/router'
import commerce from '@lib/api/commerce'
import { Layout } from '@components/common'
import { ProductView } from '@components/product'

export async function getStaticProps({
  params,
  locale,
  locales,
  preview,
}: GetStaticPropsContext<{ slug: string }>) {
  const config = { locale, locales }
  const pagesPromise = commerce.getAllPages({ config, preview })
  const siteInfoPromise = commerce.getSiteInfo({ config, preview })
  const productPromise = commerce.getProduct({
    variables: { slug: params!.slug },
    config,
    preview,
  })

  const allProductsPromise = commerce.getAllProducts({
    variables: { first: 4 },
    config,
    preview,
  })
  const { pages } = await pagesPromise
  const { categories } = await siteInfoPromise
  const { product } = await productPromise
  const { products: relatedProducts } = await allProductsPromise

  if (!product) {
    throw new Error(`Product with slug '${params!.slug}' not found`)
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
      product,
      relatedProducts,
      categories,
      headerLinks,
      footerLinks,
    },
    revalidate: 200,
  }
}

export async function getStaticPaths({ locales }: GetStaticPathsContext) {
  const { products } = await commerce.getAllProductPaths()

  return {
    paths: locales
      ? locales?.reduce<string[]>((arr, locale) => {
          // Add a product path for every locale
          products.forEach((product: any) => {
            arr.push(`/${locale}/products${product.path}`)
          })
          return arr
        }, [])
      : products.map((product: any) => `/products${product.path}`),
    fallback: 'blocking',
  }
}

export default function Slug({
  product,
  relatedProducts,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter()

  return router.isFallback ? (
    <h1>Loading...</h1>
  ) : (
    <ProductView product={product} relatedProducts={relatedProducts} />
  )
}

Slug.Layout = Layout
