import React from 'react';

import { View } from 'react-native';
import { LocationText, TemperatureText, WeatherText } from './styles';

interface HeaderProps {
  location: string | undefined;
  temperature: number | undefined;
  weatherText: string | undefined;
  handleRefresh(): void;
}

const WeatherCard: React.FC<HeaderProps> = ({
  location,
  temperature,
  weatherText,
}) => {
  const convertedTemperature = temperature && temperature - 273.15;
  return (
    <View>
      <LocationText>{location}</LocationText>
      <TemperatureText>
        {convertedTemperature && `${convertedTemperature.toFixed(0)}ºc`}
      </TemperatureText>
      <WeatherText>{weatherText}</WeatherText>
    </View>
  );
};

export default WeatherCard;
