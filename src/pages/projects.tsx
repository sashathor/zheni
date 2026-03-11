/** @jsx jsx */

import { graphql } from 'gatsby';
import { Flex, Box, Text, Link as A, jsx } from 'theme-ui';
import { Link } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';
import { Layout } from 'components';
import { jsonToHTML } from 'utils';
import { PageData, Image as ImageType, Project } from 'types';

interface ProjectsPageProps {
  data: {
    page: PageData;
    allContentfulProject: {
      projects: Project[];
    };
  };
}

const ProjectsPage: React.FC<ProjectsPageProps> = ({
  data: {
    page,
    page: { content, images },
    allContentfulProject: { projects },
  },
}) => (
  <Layout page={page}>
    {projects.map(({ id, title, featuredImage, slug }) => (
      // @TODO: upgrade theme-ui in order to fix ts-error
      <A as={Link} key={id} to={`/projects/${slug}`}>
        <Flex
          py={4}
          sx={{
            borderTop: '1px solid #e5e5e5',
            display: ['block', 'flex'],
          }}
        >
          <Box
            mb={[2, 0]}
            sx={{ width: ['auto', 200], textAlign: ['center', 'left'] }}
          >
            <Text variant="text.upperCase">{title}</Text>
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ aspectRatio: '4.5 / 2', overflow: 'hidden' }}>
              <GatsbyImage
                image={featuredImage.gatsbyImageData}
                alt={featuredImage.title || ''}
                objectFit="cover"
                style={{ height: '100%', width: '100%' }}
              />
            </Box>
          </Box>
        </Flex>
      </A>
    ))}
    {content && (
      <Box pb={4} sx={{ textAlign: 'center', color: 'secondary', mt: 4 }}>
        {jsonToHTML(content.json)}
      </Box>
    )}
  </Layout>
);

export default ProjectsPage;

export const pageQuery = graphql`
  query ($slug: String) {
    allContentfulProject(sort: { updatedAt: DESC }) {
      projects: nodes {
        id
        title
        slug
        featuredImage {
          title
          gatsbyImageData(layout: FULL_WIDTH, placeholder: BLURRED, formats: [AUTO, WEBP])
        }
      }
    }
    page: contentfulPage(slug: { eq: $slug }) {
      ...PageData
      images {
        id
        description
        gatsbyImageData(layout: FULL_WIDTH, placeholder: BLURRED, formats: [AUTO, WEBP])
      }
    }
  }
`;
