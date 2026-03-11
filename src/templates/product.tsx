/** @jsx jsx */

import { Fragment } from 'react';
import { graphql } from 'gatsby';
import { GatsbyImage, getSrc } from 'gatsby-plugin-image';
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
  preOrderTerms: {
    json: any;
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
      preOrderTerms,
    },
  },
}) => {
  const productImages = images?.filter(({ gatsbyImageData }) => gatsbyImageData);
  const imageSources = productImages?.map((img) => ({
    source: getSrc(img),
  }));
  const carousel = useCarousel();

  const { addToCart, isCartContains } = useCart();
  const active = stripeProduct?.active || false;

  const isOnRequest = status === 'OnRequest';

  const productState =
    isCartContains(id) || (!active && status !== 'PreOrder') ? (
      <Message sx={{ borderRadius: 0 }}>
        <Text variant="text.upperCase">{!active ? 'Sold' : 'Added'}</Text>
      </Message>
    ) : (
      <Button onClick={() => addToCart({ id, price, quantity: 1 })}>
        Add to cart
      </Button>
    );

  return (
    <Layout page={{ meta_title: title, meta_description: `${title} — handmade ceramic piece by Zheni Studio`, content: { json: [] } }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: title,
            description: `${title} — handmade ceramic piece by Zheni Studio`,
            image: productImages?.[0] ? getSrc(productImages[0]) : undefined,
            brand: {
              '@type': 'Brand',
              name: 'Zheni Studio',
            },
            ...(price && !isOnRequest
              ? {
                  offers: {
                    '@type': 'Offer',
                    price: (price / 100).toFixed(2),
                    priceCurrency: 'EUR',
                    availability: active
                      ? 'https://schema.org/InStock'
                      : 'https://schema.org/SoldOut',
                  },
                }
              : {}),
          }),
        }}
      />
      <Grid gap={[4, 5]} columns={[1, 2]}>
        <Box>
          <AspectRatio ratio={3 / 4}>
            <Link href="#" onClick={carousel.toggle(0)}>
              <GatsbyImage
                image={productImages[0].gatsbyImageData}
                alt={productImages[0].title || ''}
                objectFit="cover"
                style={{ height: '100%', width: '100%' }}
              />
            </Link>
          </AspectRatio>
          {productImages.length > 1 && (
            <Grid gap={2} columns={[6]} mt={2}>
              {productImages
                .filter((image, idx) => idx > 0)
                .map((image, idx) => (
                  <Box key={idx} sx={{ aspectRatio: '3/4', overflow: 'hidden' }}>
                    <Link href="#" onClick={carousel.toggle(idx + 1)}>
                      <GatsbyImage
                        image={image.gatsbyImageData}
                        alt={image.title || ''}
                        objectFit="cover"
                        style={{ height: '100%', width: '100%' }}
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
            {isOnRequest && (
              <Text mb={4} color="#c0c0c0" variant="text.upperCase">
                Price on request
              </Text>
            )}
            {!isOnRequest && (
              <Fragment>
                <Text mb={4}>
                  {formatPrice(price)}
                  {status === 'PreOrder' && <p>PRE-ORDER</p>}
                </Text>
              </Fragment>
            )}
          </Box>
          {description && <Text>{jsonToHTML(description.json)}</Text>}
          {status === 'PreOrder' && preOrderTerms && (
            <Fragment>
              <Heading variant="styles.h4" mb={4}>
                PRE ORDER TERMS
              </Heading>
              <Text>{jsonToHTML(preOrderTerms.json)}</Text>
            </Fragment>
          )}
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
      preOrderTerms {
        json: raw
      }

      stripeProduct {
        active
      }

      description {
        json: raw
      }

      images {
        id
        title
        gatsbyImageData(width: 1200, placeholder: BLURRED, formats: [AUTO, WEBP], quality: 90)
      }
    }
  }
`;
