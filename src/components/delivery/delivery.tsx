import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Select, Text, Link } from 'theme-ui';
import { countries as countriesData } from 'countries-list';
import { DeliveryType } from 'types';

function getProperty<T, K extends keyof T>(o: T, propertyName: K): T[K] {
  return o[propertyName];
}

interface DeliveryProps {
  onChange: (data?: DeliveryType) => void;
  setFetching: (state: boolean) => void;
  weight: number;
  disabled?: boolean;
}

const Delivery = ({
  onChange,
  setFetching,
  weight,
  disabled = false,
}: DeliveryProps) => {
  const [code, setCode] = useState<keyof typeof countriesData | undefined>();
  const [countries, setCountries] = useState<(keyof typeof countriesData)[]>(
    [],
  );
  const [showContact, setShowContact] = useState(false);

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
      if (!code) {
        throw new Error('Delivery country code is undefined');
      }

      setFetching(true);
      try {
        const {
          data: { response },
        } = await axios.post(`/.netlify/functions/delivery`, { code, weight });
        onChange({
          ...response,
          code,
          country: getProperty(countriesData, code),
        });
        setShowContact(!response?.price);
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
        onChange={({ target: { value } }) =>
          setCode(value as keyof typeof countriesData)
        }
      >
        <option>Add delivery destination</option>
        {countriesList.map(({ code, name }) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </Select>
      {showContact && (
        <Box mt={2}>
          <Text variant="text.upperCase" color="#c0c0c0">
            Contact{' '}
            <Link href="mailto:hello@zheni.studio">hello@zheni.studio</Link> for
            delivery options
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default Delivery;
