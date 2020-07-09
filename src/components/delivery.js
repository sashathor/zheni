import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Select, Text } from 'theme-ui';
import { countries as countriesData } from 'countries-list';

const Delivery = ({ onChange, setFetching, weight, disabled = false }) => {
  const [code, setCode] = useState();
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const fetchCountriesData = async () => {
      const {
        data: { response },
      } = await axios.get('/.netlify/functions/countries');
      setCountries(response);
    };
    fetchCountriesData();
  }, [setCountries]);

  useEffect(() => {
    const fetchDeliveryData = async () => {
      setFetching(true);
      try {
        const {
          data: { response },
        } = await axios.post(`/.netlify/functions/delivery`, { code, weight });
        onChange({ ...response, code, country: countriesData[code]?.name });
      } catch (e) {
        onChange(undefined);
      }
      setFetching(false);
    };
    if (code !== undefined && weight !== undefined) {
      fetchDeliveryData();
    }
  }, [code, weight, onChange, setFetching]);

  const countriesList = countries
    .filter((code) => countriesData[code])
    .map((code) => ({
      code,
      name: countriesData[code]?.name,
    }))
    .sort((a, b) => a.name?.localeCompare(b.name));

  return (
    <Box>
      <Text variant="text.upperCase" mb={3}>
        Send to...
      </Text>
      <Select
        disabled={disabled}
        defaultValue=""
        sx={{ borderRadius: 0, color: disabled ? '#e5e5e5' : '#666' }}
        onChange={async ({ target: { value } }) => setCode(value)}
      >
        <option>Add delivery destination</option>
        {countriesList.map(({ code, name }) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </Select>
    </Box>
  );
};

export default Delivery;
