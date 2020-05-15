/** @jsx jsx */

import { Link } from 'gatsby';
import styled from '@emotion/styled';
import { Flex, jsx, Box } from 'theme-ui';
import useCart from '../hooks/use-cart';

const NavLink = styled(Link)`
  color: ${(props) => (props.theme === 'white' ? '#ffffff' : '#000000')};
  text-decoration: none;
  text-transform: uppercase;
  display: block;

  &.current-page {
    &:after {
      content: '/';
    }
    &:before {
      content: '/';
    }
  }
  &.current-page + .sub-menu {
    display: block;
  }
`;

const PAGES = [
  { slug: 'gallery' },
  { slug: 'about' },
  { slug: 'contact' },
  { slug: 'shop' },
  { slug: 'cart' },
];

const Navigation = ({ theme }) => {
  const {
    state: { shoppingCart },
  } = useCart();

  const shoppingCartLength = Object.keys(shoppingCart).length;

  return (
    <nav role="navigation">
      <Flex
        columns={[PAGES.length]}
        sx={{
          margin: ['0 3vw', '3vh 0 10vh 40px', '3vh 0 10vh 40px'],
          justifyContent: ['center', 'flex-end', 'flex-end'],
          flexWrap: ['wrap', 'unset', 'unset'],
          alignItems: 'baseline',
        }}
      >
        {PAGES.map(({ slug, title }) => (
          <Box
            key={slug}
            sx={{
              margin: ['0 0.25rem', '0 1.5rem 0 0', '0 1.5rem 0 0'],
              float: ['left', 'none', 'none'],
              padding: '0.25rem',
              '&:last-of-type': { marginRight: ['0.25rem', 0, 0] },
            }}
          >
            <NavLink
              to={`/${slug}/`}
              theme={theme}
              activeClassName="current-page"
              partiallyActive={true}
            >
              {title || slug}
              {slug === 'cart' && (
                <sup sx={{ height: '1rem' }}>
                  {shoppingCartLength > 0 && Object.keys(shoppingCart).length}
                </sup>
              )}
            </NavLink>
          </Box>
        ))}
      </Flex>
    </nav>
  );
};

export default Navigation;
