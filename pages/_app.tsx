import '@assets/main.css'
import '@assets/chrome-bug.css'
import 'keen-slider/keen-slider.min.css'
import { FC, useEffect } from 'react'
import type { AppProps } from 'next/app'
import { Head } from '@components/common'
import { ManagedUIContext } from '@components/ui/context'
import GlobalLayout from "../components/GlobalLayout"
import { ThemeProvider } from "next-themes";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Layout } from '@components/common'
const Noop: FC = ({ children }) => <>{children}</>
export async function getStaticProps({ preview, locale, locales }) {
  //fetch banners
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
export default function MyApp({ Component, pageProps, router }: AppProps) {
  const Layout = (Component as any).Layout || Noop

  useEffect(() => {
    document.body.classList?.remove('loading')
  }, [])

  return (
    <>
      {/* <Head /> */}
      <ManagedUIContext>
         <Layout pageProps={pageProps}>
         <Component {...pageProps} />
          </Layout>
          <ToastContainer />
      </ManagedUIContext>
    </>
  )
}
MyApp.Layout = Layout;