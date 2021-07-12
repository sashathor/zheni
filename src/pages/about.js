import React from 'react';
import { graphql } from 'gatsby';
import styled from '@emotion/styled';
import Image from 'gatsby-image';
import { Grid, Box, Link } from 'theme-ui';
import Carousel from '../components/carousel';
import useCarousel from '../hooks/use-carousel';
import Layout from '../components/layout';
import jsonToHTML from '../utils/json-to-html';

const ImageStyled = styled(Image)`
  filter: grayscale(100%);
  margin-bottom: 32px;

  &:hover {
    filter: none;
  }
`;

const AboutPage = ({
  data: {
    page,
    page: { content, images },
    aboutImg,
  },
}) => {
  const imageSources = images.map((image) => image.fluid);
  const carousel = useCarousel();

  return (
    <Layout page={page}>
      <Grid gap={[0, 4]} columns={[1, '2fr 1fr']}>
        <Box sx={{ textAlign: 'left', order: [2, 1] }}>
          {jsonToHTML(content?.json)}
          <Box css={{ display: 'flex' }}>
            {images.map((image, idx) => (
              <Box key={image.id} mr={2} mt={2} css={{ width: 100 }}>
                <Link
                  key={image.id}
                  href="#"
                  onClick={(event) => carousel.toggle(event, idx)}
                >
                  <ImageStyled fluid={image.fluid} alt={image.title} fadeIn />
                </Link>
              </Box>
            ))}
            <Carousel carousel={carousel} images={imageSources} />
          </Box>
        </Box>
        <Box sx={{ order: [1, 2] }} mb={4}>
          <Image fluid={aboutImg.fluid} alt={aboutImg.description} fadeIn />
        </Box>
      </Grid>
    </Layout>
  );
};

export default AboutPage;

export const pageQuery = graphql`
  query($slug: String) {
    page: contentfulPage(slug: { eq: $slug }) {
      ...PageData
    }
    aboutImg: contentfulAsset(title: { eq: $slug }) {
      description
      fluid {
        ...GatsbyContentfulFluid_withWebp
      }
    }
  }
`;
