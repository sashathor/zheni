/** @jsx jsx */

import { graphql } from 'gatsby';
import Image from 'gatsby-image';
import { Box, Heading, Link, jsx } from 'theme-ui';
import styled from '@emotion/styled';
import Layout from '../components/layout';
import Carousel from '../components/carousel';
import useCarousel from '../hooks/use-carousel';
import jsonToHTML from '../utils/json-to-html';

const GalleryImage = styled(Image)`
  filter: grayscale(100%);
  margin-bottom: 32px;

  &:hover {
    filter: none;
  }
`;

const GalleryPage = ({
  data: {
    page,
    page: {
      content: { json },
      images,
    },
  },
}) => {
  const imageSources = images.map((image) => image.fluid);
  const carousel = useCarousel();

  return (
    <Layout page={page}>
      <Heading variant="text.pageTitle">Gallery</Heading>
      {images.map(({ id, fluid, description }, idx) => (
        <Link
          key={id}
          href="#"
          onClick={(event) => carousel.toggle(event, idx)}
        >
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
      <Box pb={4} sx={{ textAlign: 'center', color: 'secondary', mt: 4 }}>
        {jsonToHTML(json)}
      </Box>
    </Layout>
  );
};

export default GalleryPage;

export const pageQuery = graphql`
  query($slug: String) {
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
