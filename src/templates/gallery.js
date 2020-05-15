import React from 'react';
import { graphql } from 'gatsby';
import Image from 'gatsby-image';
import { Box, Heading, Grid, Link } from 'theme-ui';
import Layout from '../components/layout';
import useCarousel from '../hooks/use-carousel';
import Carousel from '../components/carousel';

const GalleryTemplate = ({
  data: {
    page,
    page: { title, images },
    allContentfulGallery: { galleries },
  },
}) => {
  const imageSources = images.map((image) => image.fluid);
  const carousel = useCarousel();

  return (
    <Layout
      page={page}
      subnavItems={galleries.map(({ slug, title }) => ({ slug, title }))}
    >
      <Heading variant="text.pageTitle">{title}</Heading>
      <Grid gap={[3, 4, 4]} columns={[2, 3, 3]}>
        {images.map(({ id, fluid, description }, idx) => (
          <Link
            key={id}
            href="#"
            onClick={(event) => carousel.toggle(event, idx)}
          >
            <Box>
              <Image
                fluid={{ ...fluid, aspectRatio: 3 / 4 }}
                alt={description}
                fadeIn
              />
            </Box>
          </Link>
        ))}
      </Grid>
      <Carousel carousel={carousel} images={imageSources} />
    </Layout>
  );
};

export default GalleryTemplate;

export const pageQuery = graphql`
  query($slug: String!) {
    allContentfulGallery {
      galleries: nodes {
        title
        slug
      }
    }
    page: contentfulGallery(slug: { eq: $slug }) {
      title
      slug
      meta_title
      meta_description
      images {
        id
        fluid {
          ...GatsbyContentfulFluid_withWebp
        }
      }
    }
  }
`;
