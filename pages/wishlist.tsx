import type { GetStaticPropsContext } from 'next'
import commerce from '@lib/api/commerce'
import { Heart } from '@components/icons'
import { Layout } from '@components/common'
import { Text, Container } from '@components/ui'
import { useCustomer } from '@framework/customer'
import { WishlistCard } from '@components/wishlist'
import useWishlist from '@framework/wishlist/use-wishlist'
import Head from 'next/head'
export async function getStaticProps({
  preview,
  locale,
  locales,
}: GetStaticPropsContext) {
  // Disabling page if Feature is not available
  if (!process.env.COMMERCE_WISHLIST_ENABLED) {
    return {
      notFound: true,
    }
  }

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

export default function Wishlist() {
  const { data: customer } = useCustomer()
  // @ts-ignore Shopify - Fix this types
  const { data, isLoading, isEmpty } = useWishlist({ includeProducts: true })

  return (
    <Container>
      <Head>
            <title>My Wishlist- Vektra Computers</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          </Head>
      <div className="mt-3 mb-20">
        <Text variant="pageHeading">My Wishlist</Text>
        <div className="group flex flex-col">
          {isLoading || isEmpty ? (
            <div className="flex-1 px-12 py-24 flex flex-col justify-center items-center ">
              <span className="border border-dashed border-secondary flex items-center justify-center w-16 h-16 bg-primary p-12 rounded-lg text-primary">
                <Heart className="absolute" />
              </span>
              <h2 className="pt-6 text-2xl font-bold tracking-wide text-center">
                Your wishlist is empty
              </h2>
              <p className="text-accent-6 px-10 text-center pt-2">
                Biscuit oat cake wafer icing ice cream tiramisu pudding cupcake.
              </p>
            </div>
          ) : (
            data &&
            // @ts-ignore Shopify - Fix this types
            data.items?.map((item) => (
              <WishlistCard key={item.id} product={item.product! as any} />
            ))
          )}
        </div>
      </div>
    </Container>
  )
}

Wishlist.Layout = Layout
