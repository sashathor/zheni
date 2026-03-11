/** @jsx jsx */

import { graphql } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';
import { Box, Text, jsx } from 'theme-ui';
import { Layout } from 'components';
import { jsonToHTML } from 'utils';
import { Project } from 'types';

interface ProjectTemplateProps {
  data: {
    project: Project;
  };
}

const ProjectTemplate: React.FC<ProjectTemplateProps> = ({
  data: {
    project: { title, description, featuredImage },
  },
}) => (
  <Layout page={{ meta_title: title, content: { json: [] } }}>
    <Box
      py={4}
      sx={{
        borderTop: '1px solid #e5e5e5',
      }}
    >
      <Box mb={3}>
        <Text variant="text.upperCase">{title}</Text>
      </Box>
      <Box sx={{ aspectRatio: '4.5 / 2', overflow: 'hidden' }}>
        <GatsbyImage
          image={featuredImage.gatsbyImageData}
          alt={featuredImage.title || ''}
          objectFit="cover"
          style={{ height: '100%', width: '100%' }}
        />
      </Box>
      <Box mt={4}>{jsonToHTML(description?.json, description?.references)}</Box>
    </Box>
  </Layout>
);

export default ProjectTemplate;

export const pageQuery = graphql`
  query ($slug: String!) {
    project: contentfulProject(slug: { eq: $slug }) {
      title
      slug
      featuredImage {
        title
        gatsbyImageData(layout: FULL_WIDTH, placeholder: BLURRED, formats: [AUTO, WEBP])
      }
      description {
        json: raw
        references {
          ... on ContentfulAsset {
            contentful_id
            title
            description
            file {
              url
            }
            gatsbyImageData(layout: FULL_WIDTH, placeholder: BLURRED, formats: [AUTO, WEBP])
          }
        }
      }
    }
  }
`;
