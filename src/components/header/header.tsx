/** @jsx jsx */

import { Link } from 'gatsby';
import Image from 'gatsby-image';
import { jsx, Flex, Box } from 'theme-ui';
import { useSmallLogo } from 'hooks';
import { Theme } from 'types';
import { Navigation } from '../navigaton';

type HeaderProps = {
  theme: Theme;
};

const Header: React.FC<HeaderProps> = ({ theme }) => {
  const smallLogo = useSmallLogo(theme);

  return (
    <header>
      <Flex
        sx={{
          justifyContent: 'space-between',
          display: ['block', 'flex'],
        }}
      >
        <Box sx={{ textAlign: ['center', 'left'] }}>
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
        <Box sx={{ pr: [0, 4] }}>
          <Navigation theme={theme} />
        </Box>
      </Flex>
    </header>
  );
};

export default Header;
