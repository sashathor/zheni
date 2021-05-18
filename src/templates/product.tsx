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
import { Carousel, Layout } from 'components';
import { useCart, useCarousel } from 'hooks';
import { formatPrice, jsonToHTML } from 'utils';
import { Image as ImageType } from 'types';

type Product = {
  title: string;
  images: ImageType[];
  description: {
    json: any;
  };
  contentful_id: string;
  price: number;
  status: 'OnRequest';
  stripeProduct: {
    active: boolean;
  };
};

interface ProductTemplateProps {
  data: {
    product: Product;
  };
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  data: {
    product: {
      title,
      images,
      description,
      contentful_id: id,
      price,
      status,
      stripeProduct,
    },
  },
}) => {
  const productImages = images?.filter(({ fluid }) => fluid);
  const imageSources = productImages?.map(({ fluid }) => ({
    source: fluid?.src,
  }));
  const carousel = useCarousel();

  const { addToCart, isCartContains } = useCart();
  const active = stripeProduct?.active || false;

  const isOnRequest = status === 'OnRequest';

  const productState =
    isCartContains(id) || !active ? (
      <Message sx={{ borderRadius: 0 }}>
        <Text variant="text.upperCase">{!active ? 'Sold' : 'Added'}</Text>
      </Message>
    ) : (
      <Button onClick={() => addToCart({ id, price, quantity: 1 })}>
        Add to cart
      </Button>
    );

  return (
    <Layout page={{ meta_title: title, content: { json: [] } }}>
      <Grid gap={[4, 5]} columns={[1, 2]}>
        <Box>
          <AspectRatio ratio={3 / 4}>
            <Link href="#" onClick={carousel.toggle(0)}>
              <Image
                fluid={{ ...productImages[0].fluid, aspectRatio: 3 / 4 }}
                alt={productImages[0].title}
                fadeIn
              />
            </Link>
          </AspectRatio>
          {productImages.length > 1 && (
            <Grid gap={2} columns={[6]} mt={2}>
              {productImages
                .filter((image, idx) => idx > 0)
                .map((image, idx) => (
                  <Box key={idx}>
                    <Link href="#" onClick={carousel.toggle(idx + 1)}>
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

          <Box mb={4}>
            {isOnRequest ? (
              <Text mb={4} color="#c0c0c0" variant="text.upperCase">
                Price on request
              </Text>
            ) : (
              <Text mb={4}>{formatPrice(price)}</Text>
            )}
          </Box>
          {description && <Text>{jsonToHTML(description.json)}</Text>}
          {!isOnRequest && productState}
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
        json: raw
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
