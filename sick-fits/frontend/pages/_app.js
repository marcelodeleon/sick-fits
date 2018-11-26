import App, {Container} from 'next/app';
import Page from '../components/Page';
import {ApolloProvider} from 'react-apollo';
import withData from '../lib/withData';

class MyApp extends App {
  static async getInitalProps({Component, ctx}) {
    let pageProps = {};
    if (Component.getInitalProps) {
      pageProps = await Component.getInitalProps(ctx);
    }

    // Exposes the query to the user. This is supposed to be done
    // automatically in future versions of Next.js
    pageProps.query = ctx.query;
    return {pageProps};
  }

  render() {
    const {Component, apollo, pageProps} = this.props;

    return (
      <Container>
        <ApolloProvider client={apollo}>
          <Page>
            <Component {...pageProps} />
          </Page>
        </ApolloProvider>
      </Container>
    );
  }
}

export default withData(MyApp);
