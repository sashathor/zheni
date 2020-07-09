import React from 'react';
import axios from 'axios';
import { Box, Input, Text } from 'theme-ui';

const Discount = ({ onCheck, discounts }) => {
  let delayTimer;

  const checkDiscount = async (code) => {
    if (!code) {
      return;
    }
    try {
      const {
        data: {
          response: { percent_off: discount, valid, free_delivery },
        },
      } = await axios.post(`/.netlify/functions/check-discount`, {
        code,
      });
      onCheck({ discount, valid, free_delivery });
    } catch (error) {
      onCheck(null);
    }
  };

  const onDiscount = ({ target: { value } }) => {
    const code = value.trim();

    if (delayTimer) {
      clearTimeout(delayTimer);
    }

    if (code === '') {
      onCheck(undefined);
      return;
    }

    delayTimer = setTimeout(() => {
      checkDiscount(code);
    }, 1000);
  };

  return (
    <Box pb={1}>
      <Text variant="text.upperCase" mb={3}>
        Discount
      </Text>
      <Input sx={{ borderRadius: 0 }} onChange={onDiscount} />
    </Box>
  );
};

export default Discount;
