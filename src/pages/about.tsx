import React from 'react';
import { graphql } from 'gatsby';
import styled from '@emotion/styled';
import Image, { FluidObject } from 'gatsby-image';
import { Grid, Box, Link } from 'theme-ui';
import { jsonToHTML } from 'utils';
import { Carousel, Layout } from 'components';
import { useCarousel } from 'hooks';
import { PageData } from 'types';

interface AboutPageProps {
  data: {
    page: PageData;
    aboutImg: {
      description: string;
      fluid: FluidObject;
    };
  };
}

const ImageStyled = styled(Image)`
  filter: grayscale(100%);
  margin-bottom: 32px;

  &:hover {
    filter: none;
  }
`;

const AboutPage: React.FC<AboutPageProps> = ({
  data: {
    page,
    page: { content, images },
    aboutImg,
  },
}) => {
  const productImages = images?.filter(({ fluid }) => fluid);
  const imageSources = productImages?.map(({ fluid }) => ({
    source: fluid?.src,
  }));
  const carousel = useCarousel();

  return (
    <Layout page={page}>
      <Grid gap={[0, 4]} columns={[1, '2fr 1fr']}>
        <Box sx={{ textAlign: 'left', order: [2, 1] }}>
          {jsonToHTML(content?.json)}
          <Box css={{ display: 'flex' }}>
            {productImages?.map((image, idx) => (
              <Box key={image.id} mr={2} mt={2} css={{ width: 100 }}>
                <Link key={image.id} href="#" onClick={carousel.toggle(idx)}>
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
