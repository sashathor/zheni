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
    },
    aboutImg,
  },
}) => (
  <Layout page={page}>
    <Grid gap={4} columns={['2fr 1fr']}>
      <Box>{jsonToHTML(json)}</Box>
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
