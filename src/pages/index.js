import React from 'react';
import { graphql } from 'gatsby';
import { css } from '@emotion/core';
import BackgroundImage from 'gatsby-background-image';
import Image from 'gatsby-image';

import Layout from '../components/layout';

const HomePage = ({ data: { page, bgImage, logoWhiteBig } }) => (
  <Layout page={page} theme="white">
    <BackgroundImage
      Tag="div"
      fluid={bgImage.fluid}
      fadeIn="soft"
      preserveStackingContext
      css={css`
        position: fixed !important;
        top: 0px;
        left: 0px;
        z-index: -1;
        width: 100vw;
        min-height: 100vh;
        height: 100%;
      `}
    />
    <Image
      fluid={logoWhiteBig.fluid}
      alt="Zheni"
      fadeIn
      css={css`
        width: 60%;
        margin: 10vh auto;
      `}
    />
  </Layout>
);

export default HomePage;

export const pageQuery = graphql`
  fragment PageData on ContentfulPage {
    meta_title
    meta_description
    title
    content: childContentfulPageContentRichTextNode {
      json
    }
  }
  query($slug: String!) {
    page: contentfulPage(slug: { eq: $slug }) {
      ...PageData
    }
    bgImage: contentfulAsset(title: { eq: "home-bg" }) {
      fluid(maxWidth: 1000, quality: 90) {
        ...GatsbyContentfulFluid_withWebp
      }
    }
    logoWhiteBig: contentfulAsset(title: { eq: "logo-white-big" }) {
      fluid {
        ...GatsbyContentfulFluid_withWebp
      }
    }
  }
`;
