/** @jsx jsx */

import { graphql } from 'gatsby';
import Image from 'gatsby-image';
import Layout from '../components/layout';
import jsonToHTML from '../utils/json-to-html';
import { Grid, Box, jsx } from 'theme-ui';

const ContactPage = ({
  data: {
    page,
    page: {
      content: { json },
    },
    contactImg,
  },
}) => (
  <Layout page={page}>
    <Grid gap={[0, 6, 6]} columns={[1, '3fr 2fr', '3fr 2fr']}>
      <Box sx={{ order: 2 }}>
        <Image fluid={contactImg.fluid} alt={contactImg.description} fadeIn />
      </Box>
      <Box sx={{ textAlign: ['center', 'right', 'right'], order: 1 }}>
        {jsonToHTML(json)}
      </Box>
    </Grid>
  </Layout>
);

export default ContactPage;

export const pageQuery = graphql`
  query($slug: String) {
    page: contentfulPage(slug: { eq: $slug }) {
      ...PageData
    }
    contactImg: contentfulAsset(title: { eq: "contact" }) {
      description
      fluid {
        ...GatsbyContentfulFluid_withWebp
      }
    }
  }
`;
