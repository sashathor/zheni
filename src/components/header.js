/** @jsx jsx */

import { Fragment } from 'react';
import { Link } from 'gatsby';
import Image from 'gatsby-image';
import { jsx } from 'theme-ui';
import useSmallLogo from '../hooks/use-small-logo';
import Navigation from './navigaton';

const Header = ({ theme, subnavItems = [] }) => {
  const smallLogo = useSmallLogo(theme);

  return (
    <Fragment>
      <Link
        to="/"
        sx={{
          position: 'absolute !important',
          top: 0,
          left: 0,
          width: '20vw',
          maxWidth: '100px',
          minWidth: '50px',
        }}
      >
        <Image fluid={smallLogo.fluid} alt={smallLogo.description} fadeIn />
      </Link>
      <header>
        <Navigation theme={theme} subnavItems={subnavItems} />
      </header>
    </Fragment>
  );
};

export default Header;
