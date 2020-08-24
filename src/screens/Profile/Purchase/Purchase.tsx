import React, {useEffect, useLayoutEffect, useState} from 'react';
import styled from 'styled-components/native';
import {GetMyProfile_GetMyProfile_user} from '../../../types/api';
import {useNavigation, RouteProp} from '@react-navigation/native';
import constants from '../../../constants';
import * as RNIap from 'react-native-iap';
import {Platform} from 'react-native';
import CashPurchaseButton from '../../../components/CashPurchaseButton';

const View = styled.View``;
const Container = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;
const Wrapper = styled.View`
  flex-direction: row;
  background-color: #ddd;
`;

const ScrollView = styled.ScrollView``;

type RouteParamProp = {
  Purchase: {
    user: GetMyProfile_GetMyProfile_user;
  };
};
type PurchaseRouteProp = RouteProp<RouteParamProp, 'Purchase'>;

interface IProp {
  route: PurchaseRouteProp;
}

const Purchase: React.FunctionComponent<IProp> = ({route}) => {
  const navigation = useNavigation();
  const [product, setProduct] = useState<RNIap.Product[]>();
  const itemSkus = Platform.select({
    ios: ['com.example.coins100'],
    android: ['com.testalkrn'],
  });
  const products = [
    {price: 3000, unit: 40},
    {price: 6000, unit: 85},
    {price: 9800, unit: 120},
    {price: 12000, unit: 150},
    {price: 19900, unit: 280},
    {price: 39900, unit: 570},
    {price: 59900, unit: 950},
  ];

  useEffect(() => {
    // const initProduct = async () => {
    //   try {
    //     console.log(itemSkus);
    //     if (itemSkus) {
    //       const products: RNIap.Product[] = await RNIap.getProducts(itemSkus);
    //       setProduct(products);
    //     }
    //   } catch (err) {
    //     console.warn(err); // standardized err.code and err.message available
    //   }
    // };
    // initProduct();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: '구매하기',
    });
  }, [navigation]);

  return (
    <>
      <ScrollView>
        <Container>
          <Wrapper>
            {products.slice(0, 3).map((e, i) => {
              return (
                <CashPurchaseButton key={i} unit={e.unit} price={e.price} />
              );
            })}
          </Wrapper>
          <Wrapper>
            {products.slice(3, 6).map((e, i) => {
              return (
                <CashPurchaseButton key={i} unit={e.unit} price={e.price} />
              );
            })}
          </Wrapper>
        </Container>
      </ScrollView>
    </>
  );
};

export default Purchase;
