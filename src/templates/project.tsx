/** @jsx jsx */

import { graphql } from 'gatsby';
import Image from 'gatsby-image';
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
      <Image
        fluid={{ ...featuredImage.fluid, aspectRatio: 4.5 / 2 }}
        alt={featuredImage.title}
        fadeIn
      />
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
        fluid {
          ...GatsbyContentfulFluid_withWebp
        }
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
            fluid {
              ...GatsbyContentfulFluid_withWebp
            }
          }
        }
      }
    }
  }
`;
