import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Alert, Close, Link, Text } from 'theme-ui';
import { useCookies } from 'react-cookie';

const GDPR_COOKIE_NAME = 'gdpr_cookie_accepted';

const GdprStyled = styled('div')`
  position: fixed;
  margin: auto;
  display: flex;
  justify-content: center;
  bottom: 30px;
  left: 0;
  right: 0;
`;

const Gdpr = () => {
  const [cookies, setCookie] = useCookies([GDPR_COOKIE_NAME]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (cookies[GDPR_COOKIE_NAME] === undefined) {
      setTimeout(() => setOpen(true), 2000);
    }
  }, [cookies]);

  const acceptCookies = () => {
    setCookie(GDPR_COOKIE_NAME, true);
    setOpen(false);
  };

  if (!open) {
    return null;
  }

  return (
    <GdprStyled>
      <Alert variant="primary">
        <Text variant="text.caps">
          We use <Link href="/cookies/">cookies</Link> to ensure that we give
          you the best experience on our website.
          <br />
          If you continue to use this site we will assume that you are happy
          with it.
        </Text>
        <Close
          ml={2}
          mr={-2}
          sx={{ cursor: 'pointer' }}
          onClick={acceptCookies}
        />
      </Alert>
    </GdprStyled>
  );
};

export default Gdpr;
