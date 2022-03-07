/** @jsx jsx */

import { graphql } from 'gatsby';
import { Flex, Box, Text, Link as A, jsx } from 'theme-ui';
import { Link } from 'gatsby';
import Image from 'gatsby-image';
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
            <Image
              fluid={{ ...featuredImage.fluid, aspectRatio: 4.5 / 2 }}
              alt={featuredImage.title}
              fadeIn
            />
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
    allContentfulProject(sort: { fields: updatedAt, order: DESC }) {
      projects: nodes {
        id
        title
        slug
        featuredImage {
          title
          fluid {
            ...GatsbyContentfulFluid_withWebp
          }
        }
      }
    }
    page: contentfulPage(slug: { eq: $slug }) {
      ...PageData
      images {
        id
        description
        fluid {
          ...GatsbyContentfulFluid_withWebp
        }
      }
    }
  }
`;
