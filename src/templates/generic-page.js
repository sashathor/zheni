import React from 'react';
import { graphql } from 'gatsby';
import { Box, Heading } from 'theme-ui';
import Layout from '../components/layout';
import jsonToHTML from '../utils/json-to-html';

const GenericPageTemplate = ({
  data: {
    page,
    page: {
      title,
      content: { json },
    },
  },
}) => (
  <Layout page={page}>
    <Box sx={{ textAlign: 'center' }}>
      <Heading variant="styles.h4" mb={4}>
        {title}
      </Heading>
      {jsonToHTML(json)}
    </Box>
  </Layout>
);

export default GenericPageTemplate;

export const pageQuery = graphql`
  query($slug: String!) {
    page: contentfulPage(slug: { eq: $slug }) {
      meta_title
      meta_description
      title
      slug
      content: childContentfulPageContentRichTextNode {
        json
      }
    }
  }
`;
