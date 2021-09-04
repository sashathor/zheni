import React from 'react';
import { graphql } from 'gatsby';
import { Box, Heading } from 'theme-ui';
import { Layout } from 'components';
import { jsonToHTML } from 'utils';
import { PageData } from 'types';

interface GenericPageTemplateProps {
  data: {
    page: PageData;
  };
}

const GenericPageTemplate: React.FC<GenericPageTemplateProps> = ({
  data: {
    page,
    page: { title, content },
  },
}) => (
  <Layout page={page}>
    <Box sx={{ textAlign: ['left', 'center'] }}>
      <Heading variant="styles.h4" mb={4}>
        {title}
      </Heading>
      {jsonToHTML(content?.json)}
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
      content {
        json: raw
      }
    }
  }
`;
