import React, { useState, useEffect, useCallback } from 'react';
import { StatusBar, PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import Spinner from 'react-native-loading-spinner-overlay';
import Icon from 'react-native-vector-icons/Feather';

import api from '../../service/api';

import Day from '../../assets/day.svg';
import Night from '../../assets/night.svg';
import RainDay from '../../assets/rain_day.svg';
import Raining from '../../assets/raining.svg';
import Winter from '../../assets/winter.svg';

import WeatherCard from '../../components/WeatherCard';
import Card from '../../components/Card';

import {
  Container,
  Content,
  IconWeather,
  CardContent,
  ContentHeader,
  ButtonRefresh,
} from './styles';

interface ILocation {
  latitude: number;
  longitude: number;
  timestamp: number;
}

interface IWeather {
  main: string;
  description: string;
  icon: string;
}

interface IMain {
  temp: number;
  pressure: number;
  humidity: number;
}

interface IWind {
  speed: number;
  deg: number;
}

interface IRain {
  rain_1h: number;
  rain_3h: number;
}

interface IWeatherData {
  weather: IWeather[];
  main: IMain;
  wind: IWind;
  rain: IRain;
  dt: number;
  name: string;
}

const Main: React.FC = () => {
  const [backgroundColor, setBackgroundColor] = useState('#FFF');

  const [hasLocationPermission, setHasLocationPermission] = useState<boolean>();
  const [location, setLocation] = useState<ILocation>({} as ILocation);

  const [weatherData, setWeatherData] = useState<IWeatherData>();
  const [typeWeather, setTypeWeather] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(true);

  async function verifyLocationPermission(): Promise<void> {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setHasLocationPermission(true);
      } else {
        setHasLocationPermission(false);
      }
    } catch (err) {
      console.warn(err);
    }
  }

  useEffect(() => {
    verifyLocationPermission();

    if (hasLocationPermission) {
      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setLocation({
            latitude,
            longitude,
            timestamp: position.timestamp,
          });
        },
        error => {
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    }
  }, [hasLocationPermission, loading]);

  useEffect(() => {
    async function loadWeather() {
      try {
        const { data } = await api.get(
          `weather?lat=${location.latitude}&lon=${location.longitude}&lang=pt_br&appid=585a3b08aea6ef15da0918e9fc4c6b71`,
        );

        if (data) {
          setWeatherData(data);

          const date = new Date();

          if (data.main.temp <= 283) {
            setTypeWeather('winter');
            setBackgroundColor(
              `${
                date.getHours() >= 18 || date.getHours() <= 5
                  ? '#4F4D64'
                  : '#F7D28E'
              }`,
            );
          } else if (data?.rain) {
            setTypeWeather('raining');
            setBackgroundColor(
              `${
                date.getHours() >= 18 || date.getHours() <= 5
                  ? '#4F4D64'
                  : '#9ECFFF'
              }`,
            );
          } else {
            setTypeWeather(
              `${
                date.getHours() >= 18 || date.getHours() <= 5 ? 'night' : 'day'
              }`,
            );
            setBackgroundColor(
              `${
                date.getHours() >= 18 || date.getHours() <= 5
                  ? '#4F4D64'
                  : '#F7D28E'
              }`,
            );
          }

          setTimeout(() => {
            setLoading(false);
          }, 1000);
        }
      } catch (err) {
        console.warn(err.message);
      }
    }
    if (location && hasLocationPermission) {
      loadWeather();
    }
  }, [location, loading, hasLocationPermission]);

  const handleRefresh = useCallback(() => {
    setLoading(true);
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={backgroundColor} />
      <Container backgroundColor={backgroundColor}>
        {loading ? (
          <Spinner visible={loading} />
        ) : (
          <Content>
            <ButtonRefresh onPress={handleRefresh}>
              <Icon name="refresh-cw" size={24} color="#fff" />
            </ButtonRefresh>

            <ContentHeader>
              <WeatherCard
                location={weatherData?.name}
                temperature={weatherData?.main.temp}
                weatherText={weatherData?.weather[0].description}
                handleRefresh={handleRefresh}
              />
            </ContentHeader>

            <IconWeather>
              {typeWeather === 'day' && <Day width={300} height={268} />}
              {typeWeather === 'night' && <Night width={300} height={268} />}
              {typeWeather === 'rain_day' && (
                <RainDay width={300} height={268} />
              )}
              {typeWeather === 'raining' && (
                <Raining width={300} height={268} />
              )}
              {typeWeather === 'winter' && <Winter width={300} height={268} />}
            </IconWeather>

            <CardContent>
              <Card
                title="Humidade"
                description={`${weatherData?.main.humidity.toString()}%`}
              />
              <Card
                title="Pressão"
                description={`${weatherData?.main.pressure.toString()} hPa`}
              />
              <Card
                title="Vento"
                description={`${weatherData?.wind.speed.toString()} m/s`}
              />
            </CardContent>
          </Content>
        )}
      </Container>
    </>
  );
};

export default Main;
