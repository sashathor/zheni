/** @jsx jsx */

import { graphql } from 'gatsby';
import Image from 'gatsby-image';
import {
  Box,
  Button,
  Heading,
  Grid,
  Link,
  Text,
  jsx,
  AspectRatio,
  Message,
} from 'theme-ui';
import Layout from '../components/layout';
import Carousel from '../components/carousel';
import useCart from '../hooks/use-cart';
import useCarousel from '../hooks/use-carousel';
import formatPrice from '../utils/format-price';
import jsonToHTML from '../utils/json-to-html';

const ProductTemplate = ({
  data: {
    product: {
      title,
      images,
      description,
      contentful_id: id,
      price,
      stripeProduct,
    },
  },
}) => {
  const imageSources = images.map((image) => image.fluid);
  const carousel = useCarousel();
  const { addToCart, isCartContains } = useCart();
  const active = stripeProduct?.active || false;

  return (
    <Layout page={{ meta_title: title }}>
      <Grid gap={[4, 5]} columns={[1, 2]}>
        <Box>
          <AspectRatio ratio={3 / 4}>
            <Link href="#" onClick={(event) => carousel.toggle(event, 0)}>
              <Image
                fluid={{ ...images[0].fluid, aspectRatio: 3 / 4 }}
                alt={images[0].title}
                fadeIn
              />
            </Link>
          </AspectRatio>
          {images.length > 1 && (
            <Grid gap={2} columns={[6]} mt={2}>
              {images
                .filter((image, idx) => idx > 0)
                .map((image, idx) => (
                  <Box key={idx}>
                    <Link
                      href="#"
                      onClick={(event) => carousel.toggle(event, idx + 1)}
                    >
                      <Image
                        fluid={{ ...image.fluid, aspectRatio: 3 / 4 }}
                        alt={image.title}
                        fadeIn
                      />
                    </Link>
                  </Box>
                ))}
            </Grid>
          )}
          <Carousel carousel={carousel} images={imageSources} />
        </Box>
        <Box>
          <Heading variant="styles.h4" mb={4}>
            {title}
          </Heading>
          <Text mb={4}>{formatPrice(price)}</Text>
          {description && <Text>{jsonToHTML(description.json)}</Text>}
          {isCartContains(id) || !active ? (
            <Message sx={{ borderRadius: 0 }}>
              <Text variant="text.upperCase">{!active ? 'Sold' : 'Added'}</Text>
            </Message>
          ) : (
            <Button onClick={() => addToCart({ id, price, quantity: 1 })}>
              Add to cart
            </Button>
          )}
        </Box>
      </Grid>
    </Layout>
  );
};

export default ProductTemplate;

export const pageQuery = graphql`
  query($slug: String!) {
    product: contentfulProduct(slug: { eq: $slug }) {
      title
      slug
      contentful_id
      price
      status

      stripeProduct {
        active
      }

      description {
        json
      }

      images {
        id
        title
        fluid(maxWidth: 1200, quality: 90) {
          ...GatsbyContentfulFluid_withWebp
        }
      }
    }
  }
`;
