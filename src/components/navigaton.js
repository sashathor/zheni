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

const Navigation = ({ theme, subnavItems }) => {
  const {
    state: { shoppingCart },
  } = useCart();

  const shoppingCartLength = Object.keys(shoppingCart).length;

  return (
    <nav role="navigation">
      <Flex
        columns={[PAGES.length]}
        sx={{
          margin: '3vh 0 10vh 40px',
          justifyContent: 'flex-end',
          alignItems: 'baseline',
        }}
      >
        {PAGES.map(({ slug, title, children = subnavItems }) => (
          <Box
            key={slug}
            sx={{
              marginRight: '1.5rem',
              padding: '0.25rem',
              '&:last-of-type': { marginRight: 0 },
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
            {children.length > 0 && (
              <div className="sub-menu" sx={{ display: 'none' }}>
                {children.map(({ slug: childSlug, title: childTitle }) => (
                  <NavLink
                    key={childSlug}
                    to={`/${slug}/${childSlug}`}
                    theme={theme}
                  >
                    {childTitle || childSlug}
                  </NavLink>
                ))}
              </div>
            )}
          </Box>
        ))}
      </Flex>
    </nav>
  );
};

export default Navigation;
