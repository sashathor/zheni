/** @jsx jsx */

import { Link } from 'gatsby';
import styled from '@emotion/styled';
import { Box, Divider, Flex, jsx } from 'theme-ui';

const NavLink = styled(Link)`
  color: ${({ theme }) =>
    theme === 'white' ? 'rgba(255, 255, 255, 0.3)' : '#c0c0c0'};
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
`;

const PAGES = [
  { slug: 'orders' },
  { slug: 'privacy' },
  { slug: 'cookies' },
  { slug: 'terms' },
];

const Footer = ({ theme }) => (
  <footer sx={{ mt: '5rem' }}>
    <Divider />
    <nav>
      <Flex
        columns={[PAGES.length]}
        sx={{
          marginBottom: '1rem',
          justifyContent: 'flex-end',
          alignItems: 'baseline',
        }}
      >
        {PAGES.map(({ slug, title }) => (
          <Box
            key={slug}
            sx={{
              padding: '0.25rem',
              marginRight: '1rem',
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
            </NavLink>
          </Box>
        ))}
      </Flex>
    </nav>
  </footer>
);

export default Footer;
