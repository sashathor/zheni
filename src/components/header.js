/** @jsx jsx */

import { Link } from 'gatsby';
import Image from 'gatsby-image';
import { jsx, Flex, Box } from 'theme-ui';
import useSmallLogo from '../hooks/use-small-logo';
import Navigation from './navigaton';

const Header = ({ theme, subnavItems = [] }) => {
  const smallLogo = useSmallLogo(theme);

  return (
    <header sx={{ mb: 3 }}>
      <Flex sx={{ justifyContent: 'space-between' }}>
        <Box>
          <Link to="/">
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
        <Box sx={{ pr: 4 }}>
          <Navigation theme={theme} subnavItems={subnavItems} />
        </Box>
      </Flex>
    </header>
  );
};

export default Header;
