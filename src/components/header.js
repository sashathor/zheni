/** @jsx jsx */

import { Link } from 'gatsby';
import Image from 'gatsby-image';
import { jsx, Flex, Box } from 'theme-ui';
import useSmallLogo from '../hooks/use-small-logo';
import Navigation from './navigaton';

const Header = ({ theme, subnavItems = [] }) => {
  const smallLogo = useSmallLogo(theme);

  return (
    <header sx={{ mb: 5 }}>
      <Flex
        sx={{
          justifyContent: 'space-between',
          display: ['block', 'flex', 'flex'],
        }}
      >
        <Box sx={{ textAlign: ['center', 'left', 'left'] }}>
          <Link to="/" sx={{ display: 'inline-block' }}>
            <Image
              sx={{
                width: '20vw',
                maxWidth: '100px',
                minWidth: '50px',
              }}
              fluid={smallLogo.fluid}
              alt={smallLogo.description}
              fadeIn
            />
          </Link>
        </Box>
        <Box sx={{ pr: [0, 4, 4] }}>
          <Navigation theme={theme} subnavItems={subnavItems} />
        </Box>
      </Flex>
    </header>
  );
};

export default Header;
