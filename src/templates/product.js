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
      description: { json },
      sku,
      stripeSku,
    },
  },
}) => {
  const imageSources = images.map((image) => image.fluid);
  const carousel = useCarousel();
  const { addToCart, isCartContains } = useCart();
  const { price, currency } = stripeSku || { price: 0, currency: 'eur' };

  return (
    <Layout page={{ meta_title: title }}>
      <Grid gap={5} columns={[2]}>
        <Box>
          <AspectRatio ratio={3 / 4}>
            <Link href="#" onClick={(event) => carousel.toggle(event, 0)}>
              <Image
                fluid={images[0].fluid}
                alt={images[0].description}
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
                      onClick={(event) => carousel.toggle(event, idx)}
                    >
                      <Image
                        fluid={image.fluid}
                        alt={image.description}
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
          <Text mb={4}>{formatPrice(price, currency)}</Text>
          <Text>{jsonToHTML(json)}</Text>
          {isCartContains(sku) ? (
            <Message sx={{ borderRadius: 0 }}>Item added to cart</Message>
          ) : (
            <Button onClick={() => addToCart({ sku, price, quantity: 1 })}>
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
      sku

      description {
        json
      }

      images {
        id
        fluid {
          ...GatsbyContentfulFluid_withWebp
        }
      }

      stripeSku {
        currency
        price
      }
    }
  }
`;
