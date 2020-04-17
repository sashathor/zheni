/** @jsx jsx */

import { Fragment } from 'react';
import Helmet from 'react-helmet';
import { Global, css } from '@emotion/core';
import { Container, jsx } from 'theme-ui';
import Header from './header';
import Footer from './footer';

const Layout = ({ children, subnavItems, page, theme = 'black' }) => {
  const { meta_title, meta_description } = page
    ? page
    : {
        meta_title: 'Zheni',
        meta_description: 'Zheni website',
      };

  return (
    <Fragment>
      <Global
        styles={css`
          * {
            box-sizing: border-box;
            margin: 0;
          }

          html,
          body {
            margin: 0;
          }
        `}
      />
      <Helmet>
        <title>{meta_title}</title>
        <meta name="description" content={meta_description} />
      </Helmet>
      <Container
        sx={{
          maxWidth: '90vw',
          width: '768px',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Header theme={theme} subnavItems={subnavItems} />
        <main sx={{ flex: '1 1 auto' }}>{children}</main>
        <Footer theme={theme} />
      </Container>
    </Fragment>
  );
};

export default Layout;
