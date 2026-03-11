/** @jsx jsx */

import { Link } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';
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
          <Link to="/" sx={{ display: 'inline-block', marginLeft: [0, -34] }}>
            <GatsbyImage
              image={smallLogo.gatsbyImageData}
              alt={smallLogo.description}
              style={{
                width: '20vw',
                maxWidth: '100px',
                minWidth: '50px',
              }}
            />
          </Link>
        </Box>
        <Box>
          <Navigation theme={theme} />
        </Box>
      </Flex>
    </header>
  );
};

export default Header;
