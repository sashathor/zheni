/** @jsx jsx */

import { graphql, Link } from 'gatsby';
import BackgroundImage from 'gatsby-background-image';
import { AspectRatio, Box, Heading, Grid, jsx } from 'theme-ui';
import Layout from '../components/layout';
import jsonToHTML from '../utils/json-to-html';

const GalleryPage = ({
  data: {
    page,
    page: {
      content: { json },
    },
    allContentfulGallery: { galleries },
  },
}) => (
  <Layout
    page={page}
    subnavItems={galleries.map(({ slug, title }) => ({ slug, title }))}
  >
    <Heading variant="text.pageTitle">Gallery</Heading>
    <Grid gap={4} columns={[2]}>
      {galleries.map(({ slug, title, images }) => (
        <AspectRatio key={slug} ratio={3 / 4}>
          <Link
            to={`/gallery/${slug}`}
            sx={{ color: '#fff', textDecoration: 'none' }}
          >
            <BackgroundImage
              fluid={images[0].fluid}
              Tag="section"
              fadeIn="soft"
              sx={{ width: '100%', height: '100%' }}
            >
              <Heading variant="styles.h4" p="5%" pt="50%">
                {title}
              </Heading>
            </BackgroundImage>
          </Link>
        </AspectRatio>
      ))}
    </Grid>
    <Box pb={4} sx={{ textAlign: 'center', color: 'secondary', mt: 4 }}>
      {jsonToHTML(json)}
    </Box>
  </Layout>
);

export default GalleryPage;

export const pageQuery = graphql`
  query($slug: String) {
    page: contentfulPage(slug: { eq: $slug }) {
      ...PageData
    }
    allContentfulGallery {
      galleries: nodes {
        title
        slug
        images {
          fluid {
            ...GatsbyContentfulFluid_withWebp
          }
        }
      }
    }
  }
`;
