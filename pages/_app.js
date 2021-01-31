import Head from 'next/head'
import '../style.css'

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>React Server Components (Experimental Demo)</title>
        <meta httpEquiv="Content-Language" content="en" />
        <meta
          name="description"
          content="Experimental demo of React Server Components with Next.js. Hosted on Vercel."
        />
        <meta
          name="og:description"
          content="Experimental demo of React Server Components with Next.js. Hosted on Vercel."
        />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
