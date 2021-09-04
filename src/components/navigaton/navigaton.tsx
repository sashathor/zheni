/** @jsx jsx */

import { Link } from 'gatsby';
import styled from '@emotion/styled';
import { Flex, jsx, Box } from 'theme-ui';
import { useAvailableProducts } from 'hooks';
import { Theme } from 'types';

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

const PAGES: { slug: string; title?: string }[] = [
  { slug: 'gallery' },
  { slug: 'about' },
  { slug: 'contact' },
  { slug: 'shop' },
  { slug: 'cart' },
];

const Navigation = ({ theme }: { theme: Theme }) => {
  const { availableProducts } = useAvailableProducts();

  return (
    <nav role="navigation">
      <Flex
        sx={{
          margin: ['0 3vw', '3vh 0 10vh 40px'],
          justifyContent: ['center', 'flex-end'],
          flexWrap: ['wrap', 'unset'],
          alignItems: 'baseline',
        }}
      >
        {PAGES.map(({ slug, title }) => (
          <Box
            key={slug}
            sx={{
              margin: ['0 0.25rem', '0 1.5rem 0 0'],
              float: ['left', 'none'],
              padding: '0.25rem',
              '&:last-of-type': { marginRight: ['0.25rem', 0] },
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
                  {availableProducts &&
                    availableProducts.length > 0 &&
                    availableProducts.length}
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
