/** @jsx jsx */

import { Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { Global, css } from '@emotion/react';
import styled from '@emotion/styled';
import { Container, jsx } from 'theme-ui';
import { PageData, Theme } from 'types';
import { Header } from '../header';
import { Footer } from '../footer';
import { Gdpr } from '../gdpr';

const LayoutContainer = styled(Container)`
  max-width: 90vw;
  width: 768px;
`;

interface LayoutProps {
  page: PageData;
  theme?: Theme;
}

const Layout: React.FC<LayoutProps> = ({ children, page, theme = 'black' }) => {
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

          /* Quick fix for image carousel */
          .react-images__view-image {
            max-height: 90vh !important;
          }
        `}
      />
      <Helmet>
        <title>{meta_title}</title>
        <meta name="description" content={meta_description} />
        <meta
          name="p:domain_verify"
          content="8e6b63387bd786744b1d82dfb4c180fc"
        />
      </Helmet>
      <div
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Header theme={theme} />
        <LayoutContainer sx={{ flex: '1 1 auto' }}>
          <main sx={{}}>{children}</main>
        </LayoutContainer>
        {theme !== 'white' && (
          <LayoutContainer>
            <Footer theme={theme} />
          </LayoutContainer>
        )}
        <Gdpr />
      </div>
    </Fragment>
  );
};

export default Layout;
