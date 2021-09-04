/** @jsx jsx */

import { graphql } from 'gatsby';
import Image, { FluidObject } from 'gatsby-image';
import { Grid, Box, jsx } from 'theme-ui';
import { PageData } from 'types';
import { Layout } from 'components';
import { jsonToHTML } from 'utils';

interface ContactPage {
  data: {
    page: PageData;
    contactImg: {
      description: string;
      fluid: FluidObject;
    };
  };
}

const ContactPage: React.FC<ContactPage> = ({
  data: {
    page,
    page: { content },
    contactImg,
  },
}) => (
  <Layout page={page}>
    <Grid gap={[0, 6]} columns={[1, '3fr 2fr']}>
      <Box sx={{ order: 2 }}>
        <Image fluid={contactImg.fluid} alt={contactImg.description} fadeIn />
      </Box>
      {content && (
        <Box sx={{ textAlign: ['left', 'right'], order: 1 }}>
          {jsonToHTML(content.json)}
        </Box>
      )}
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
