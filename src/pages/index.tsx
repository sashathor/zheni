/** @jsx jsx */

import { graphql } from 'gatsby';
import { GatsbyImage, IGatsbyImageData, getSrc } from 'gatsby-plugin-image';
import { css } from '@emotion/react';
import { Flex, jsx } from 'theme-ui';
import { PageData } from 'types';
import { Layout } from 'components';

type FeaturedLogo = {
  id: string;
  description: string;
  gatsbyImageData: IGatsbyImageData;
};

interface HomePageProps {
  data: {
    page: PageData;
    bgImage: {
      gatsbyImageData: IGatsbyImageData;
    };
    logoWhiteBig: {
      gatsbyImageData: IGatsbyImageData;
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
    <h1 style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', borderWidth: 0 }}>Zheni Studio — Handmade Ceramics</h1>
    <GatsbyImage
      image={bgImage.gatsbyImageData}
      alt=""
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: -1,
        width: '100vw',
        minHeight: '100vh',
        height: '100%',
      }}
    />
    <GatsbyImage
      image={logoWhiteBig.gatsbyImageData}
      alt="Zheni"
      style={{
        position: 'absolute',
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
        featuredLogos.map((featuredLogo) => (
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
            <GatsbyImage
              image={featuredLogo.gatsbyImageData}
              objectFit="contain"
              style={{ height: '100%', width: '100%' }}
              alt={featuredLogo.description}
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
      gatsbyImageData(layout: FULL_WIDTH, placeholder: BLURRED, formats: [AUTO, WEBP])
    }
  }
  query($slug: String!) {
    page: contentfulPage(slug: { eq: $slug }) {
      ...PageData
    }
    bgImage: contentfulAsset(title: { eq: "home-bg" }) {
      gatsbyImageData(layout: FULL_WIDTH, placeholder: BLURRED, formats: [AUTO, WEBP], quality: 90)
    }
    logoWhiteBig: contentfulAsset(title: { eq: "logo-white-big" }) {
      gatsbyImageData(layout: FULL_WIDTH, placeholder: BLURRED, formats: [AUTO, WEBP])
    }
    allContentfulAsset(filter: { title: { eq: "featured-logo" } }) {
      featuredLogos: nodes {
        id
        description
        gatsbyImageData(width: 100, placeholder: BLURRED, formats: [AUTO, WEBP])
      }
    }
  }
`;
