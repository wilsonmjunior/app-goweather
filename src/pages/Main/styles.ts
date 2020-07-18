import styled from 'styled-components/native';

interface ContainerProps {
  backgroundColor: string;
}

export const Container = styled.View<ContainerProps>`
  flex: 1;
  background-color: ${props => props.backgroundColor};
`;

export const Content = styled.View`
  margin: 0 24px;
`;

export const IconWeather = styled.View`
  align-items: center;
  justify-content: center;
  margin-top: 56px;
`;

export const CardContent = styled.View`
  flex-direction: row;
  z-index: 999;
`;

export const ContentHeader = styled.View`
  margin-top: 48px;
`;

export const ButtonRefresh = styled.TouchableOpacity`
  position: absolute;
  right: 0;
  top: 20px;
  border-color: #232129;

  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
