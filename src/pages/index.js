/** @jsx jsx */

import { graphql } from 'gatsby';
import { css } from '@emotion/core';
import { Flex, jsx } from 'theme-ui';
import BackgroundImage from 'gatsby-background-image';
import Image from 'gatsby-image';

import Layout from '../components/layout';

const HomePage = ({
  data: {
    page,
    bgImage,
    logoWhiteBig,
    allContentfulAsset: { featuredLogos },
  },
}) => (
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
    <Flex
      sx={{
        justifyContent: 'center',
        position: 'absolute',
        bottom: 10,
        left: 0,
        right: 0,
        flexWrap: 'wrap',
        marginLeft: 10,
        marginRight: 10,
      }}
    >
      {featuredLogos &&
        featuredLogos.map((featuredLogo, index) => (
          <Flex
            key={featuredLogo.id}
            sx={{
              backgroundColor: '#ffffff',
              opacity: [0.8, 0.5],
              margin: 10,
              // marginLeft: index === 0 ? 0 : 20,
              padding: 10,
              width: ['20vw', '10vw'],
              maxWidth: 100,
            }}
          >
            <Image
              fluid={{ ...featuredLogo.fluid, aspectRatio: 4 / 3 }}
              imgStyle={{ objectFit: 'contain' }}
              style={{ height: '100%', width: '100%' }}
              alt={featuredLogo.description}
              title={featuredLogo.description}
              fadeIn
            />
          </Flex>
        ))}
    </Flex>
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
    images {
      id
      title
      fluid {
        ...GatsbyContentfulFluid_withWebp
      }
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
    allContentfulAsset(filter: { title: { eq: "featured-logo" } }) {
      featuredLogos: nodes {
        id
        description
        fluid(maxWidth: 100, maxHeight: 100) {
          ...GatsbyContentfulFluid_withWebp
        }
      }
    }
  }
`;
