import React, { useEffect } from 'react';
import { graphql } from 'gatsby';
import { Box, Heading } from 'theme-ui';
import { PageData } from 'types';
import { Layout } from 'components';
import { useCart } from 'hooks';
import { jsonToHTML } from 'utils';

interface OrderConfirmedPageProps {
  data: {
    page: PageData;
  };
}

const OrderConfirmedPage: React.FC<OrderConfirmedPageProps> = ({
  data: {
    page,
    page: { title, content },
  },
}) => {
  const { clearCart } = useCart();

  useEffect(() => clearCart());

  return (
    <Layout page={page}>
      <Box sx={{ textAlign: ['left', 'center'] }}>
        <Heading variant="styles.h4" mb={4}>
          {title}
        </Heading>
        {jsonToHTML(content?.json)}
      </Box>
    </Layout>
  );
};

export default OrderConfirmedPage;

export const pageQuery = graphql`
  query($slug: String!) {
    page: contentfulPage(slug: { eq: $slug }) {
      meta_title
      meta_description
      title
      slug
      content {
        json: raw
      }
    }
  }
`;
