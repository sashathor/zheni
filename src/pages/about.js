import React from 'react';
import { graphql } from 'gatsby';
import Image from 'gatsby-image';
import { Grid, Box } from 'theme-ui';
import Layout from '../components/layout';
import jsonToHTML from '../utils/json-to-html';

const AboutPage = ({
  data: {
    page,
    page: {
      content: { json },
      images,
    },
    aboutImg,
  },
}) => (
  <Layout page={page}>
    <Grid gap={[0, 4]} columns={[1, '2fr 1fr']}>
      <Box sx={{ textAlign: 'left' }}>
        {jsonToHTML(json)}
        <Box css={{ display: 'flex' }}>
          {images.map((image) => (
            <Box key={image.id} mr={2} mt={2} css={{ width: 100 }}>
              <Image fluid={image.fluid} alt={image.title} fadeIn />
            </Box>
          ))}
        </Box>
      </Box>
      <Box>
        <Image fluid={aboutImg.fluid} alt={aboutImg.description} fadeIn />
      </Box>
    </Grid>
  </Layout>
);

export default AboutPage;

export const pageQuery = graphql`
  query($slug: String) {
    page: contentfulPage(slug: { eq: $slug }) {
      ...PageData
    }
    aboutImg: contentfulAsset(title: { eq: $slug }) {
      description
      fluid {
        ...GatsbyContentfulFluid_withWebp
      }
    }
  }
`;
