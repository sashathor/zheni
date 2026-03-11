/** @jsx jsx */

import { graphql } from 'gatsby';
import { GatsbyImage, getSrc } from 'gatsby-plugin-image';
import { Box, Heading, Link, jsx } from 'theme-ui';
import { Carousel, Layout } from 'components';
import { useCarousel } from 'hooks';
import { jsonToHTML } from 'utils';
import { PageData } from 'types';

interface GalleryPageProps {
  data: {
    page: PageData;
  };
}

const GalleryPage: React.FC<GalleryPageProps> = ({ data: { page } }) => {
  const { content, images } = page ?? {};
  const imageSources = images
    ?.filter(({ gatsbyImageData }) => gatsbyImageData)
    .map((img) => ({
      source: getSrc(img),
    }));
  const carousel = useCarousel();

  return (
    <Layout page={page}>
      <Heading variant="text.pageTitle">Gallery</Heading>
      {images
        ?.filter(({ gatsbyImageData }) => gatsbyImageData)
        .map(({ id, gatsbyImageData, description }, idx) => (
          <Link key={id} href="#" onClick={carousel.toggle(idx)}>
            <Box
              sx={{
                filter: 'grayscale(100%)',
                mb: '32px',
                '&:hover': { filter: 'none' },
              }}
            >
              <GatsbyImage
                image={gatsbyImageData}
                alt={description || ''}
              />
            </Box>
          </Link>
        ))}
      <Carousel carousel={carousel} images={imageSources} />
      {content && (
        <Box pb={4} sx={{ textAlign: 'center', color: 'secondary', mt: 4 }}>
          {jsonToHTML(content.json)}
        </Box>
      )}
    </Layout>
  );
};

export default GalleryPage;

export const pageQuery = graphql`
  query ($slug: String) {
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
