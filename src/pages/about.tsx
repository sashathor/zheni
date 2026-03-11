/** @jsx jsx */

import { graphql } from 'gatsby';
import { GatsbyImage, IGatsbyImageData, getSrc } from 'gatsby-plugin-image';
import { Grid, Box, Link, jsx } from 'theme-ui';
import { jsonToHTML } from 'utils';
import { Carousel, Layout } from 'components';
import { useCarousel } from 'hooks';
import { PageData } from 'types';

interface AboutPageProps {
  data: {
    page: PageData;
    aboutImg: {
      description: string;
      gatsbyImageData: IGatsbyImageData;
    };
  };
}

const AboutPage: React.FC<AboutPageProps> = ({
  data: {
    page,
    page: { content, images },
    aboutImg,
  },
}) => {
  const pageImages = images?.filter(({ gatsbyImageData }) => gatsbyImageData);
  const imageSources = pageImages?.map((img) => ({
    source: getSrc(img),
  }));
  const carousel = useCarousel();

  return (
    <Layout page={page}>
      <Grid gap={[0, 4]} columns={[1, '2fr 1fr']}>
        <Box sx={{ textAlign: 'left', order: [2, 1] }}>
          {jsonToHTML(content?.json)}
          <Box css={{ display: 'flex' }}>
            {pageImages?.map((image, idx) => (
              <Box key={image.id} mr={2} mt={2} css={{ width: 100 }}>
                <Link key={image.id} href="#" onClick={carousel.toggle(idx)}>
                  <Box
                    sx={{
                      filter: 'grayscale(100%)',
                      mb: '32px',
                      '&:hover': { filter: 'none' },
                    }}
                  >
                    <GatsbyImage
                      image={image.gatsbyImageData}
                      alt={image.title || ''}
                    />
                  </Box>
                </Link>
              </Box>
            ))}
            <Carousel carousel={carousel} images={imageSources} />
          </Box>
        </Box>
        <Box sx={{ order: [1, 2] }} mb={4}>
          <GatsbyImage image={aboutImg.gatsbyImageData} alt={aboutImg.description} />
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
      gatsbyImageData(layout: FULL_WIDTH, placeholder: BLURRED, formats: [AUTO, WEBP])
    }
  }
`;
