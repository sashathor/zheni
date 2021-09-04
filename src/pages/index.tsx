/** @jsx jsx */

import { graphql } from 'gatsby';
import { css } from '@emotion/react';
import { Flex, jsx } from 'theme-ui';
import BackgroundImage from 'gatsby-background-image';
import Image, { FluidObject } from 'gatsby-image';
import { PageData } from 'types';
import { Layout } from 'components';

type FeaturedLogo = {
  id: string;
  description: string;
  fluid: FluidObject;
};

interface HomePageProps {
  data: {
    page: PageData;
    bgImage: {
      fluid: FluidObject;
    };
    logoWhiteBig: {
      fluid: FluidObject;
    };
    allContentfulAsset: {
      featuredLogos: FeaturedLogo[];
    };
  };
}

const HomePage: React.FC<HomePageProps> = ({
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
      sx={{
        position: 'absolute !important',
        width: '50%',
        margin: 'auto',
        top: '40%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
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
    content {
      json: raw
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
