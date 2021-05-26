import NProgress from 'nprogress';
import Router from 'next/router'; 
import Page from '../components/Page';
import '../components/styles/nprogress.css';
import { ApolloProvider } from '@apollo/client';
import widthData from '../lib/withData';
import { Component } from 'react';

Router.events.on('routerChangeStart', () => NProgress.start());
Router.events.on('routerChangeComplete', () => NProgress.done());
Router.events.on('routerChangeError', () => NProgress.done());

function MyApp({ Component, pageProps, apollo }) {
    console.log(apollo)
;    return (
        <ApolloProvider client={ apollo }>
            <Page>
                <Component {...pageProps} />
            </Page>        
        </ApolloProvider>
    );
}

MyApp.getInitialProps = async function({ Component, ctx }) {
    let pageProps = {};
    if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps(ctx);
    }
    pageProps.query = ctx.query;
    return { pageProps };
} 

export default widthData(MyApp);