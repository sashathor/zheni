/** @jsx jsx */

import { graphql } from 'gatsby';
import Image from 'gatsby-image';
import { Box, Heading, Link, jsx } from 'theme-ui';
import styled from '@emotion/styled';
import { Carousel, Layout } from 'components';
import { useCarousel } from 'hooks';
import { jsonToHTML } from 'utils';
import { PageData } from 'types';

const GalleryImage = styled(Image)`
  filter: grayscale(100%);
  margin-bottom: 32px;

  &:hover {
    filter: none;
  }
`;

interface GalleryPageProps {
  data: {
    page: PageData;
  };
}

const GalleryPage: React.FC<GalleryPageProps> = ({ data: { page } }) => {
  const { content, images } = page ?? {};
  const imageSources = images
    ?.filter(({ fluid }) => fluid)
    .map(({ fluid }) => ({
      source: fluid?.src,
    }));
  const carousel = useCarousel();

  return (
    <Layout page={page}>
      <Heading variant="text.pageTitle">Gallery</Heading>
      {images
        ?.filter(({ fluid }) => fluid)
        .map(({ id, fluid, description }, idx) => (
          <Link key={id} href="#" onClick={carousel.toggle(idx)}>
            <Box>
              <GalleryImage
                fluid={{ ...fluid, aspectRatio: 3 / 4 }}
                alt={description}
                fadeIn
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
        fluid {
          ...GatsbyContentfulFluid_withWebp
        }
      }
    }
  }
`;
