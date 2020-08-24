import React, {useState} from 'react';
import styled from 'styled-components/native';
import {CategoryType, CategoryProp} from '../../screens/Home/People/People';
import {ScrollView} from 'react-native-gesture-handler';
import {GetUserListMeans} from '../../types/api.d';
interface ContainerProp {
  height: number;
}

const Container = styled.View<ContainerProp>`
  justify-content: center;
  align-items: center;
  height: ${(props: any) => `${props.height / 3}px`};
`;
interface TouchableProp {
  currentTab: CategoryType;
}
const Touchable = styled.TouchableOpacity<TouchableProp>`
  width: 112px;
  height: 100%;
  justify-content: center;
  align-items: center;
  background-color: ${(props: any) =>
    props.currentTab === 'people'
      ? props.theme.backPrimaryColor
      : props.theme.whiteColor};
  border-bottom-width: 1px;
  border-color: ${(props: any) => props.theme.darkGreyColor};
`;
const Text = styled.Text`
  text-align: center;
  font-size: 13px;
  color: ${(props: any) => props.theme.blackColor};
`;
const SelectText = styled.Text`
  text-align: center;
  font-size: 14px;
  font-weight: 700;
  color: ${(props: any) => props.theme.blackColor};
`;

interface IProp {
  category: GetUserListMeans;
  categories: CategoryProp[];
  setCategory: Function;
  headerHeight: number;
}

const HeaderCategoryTab: React.FunctionComponent<IProp> = ({
  category,
  categories,
  setCategory,
  headerHeight,
}) => {
  const [tabState, setTabState] = useState<GetUserListMeans>(category);

  return (
    <Container height={headerHeight}>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {categories &&
          categories.length > 0 &&
          categories.map((e, i) => {
            if (category === e.type) {
              return (
                <Touchable
                  key={i}
                  activeOpacity={0.8}
                  currentTab={tabState}
                  onPress={() => {
                    setCategory(e.type);
                    setTabState(e.type);
                  }}>
                  <SelectText>{e.name}</SelectText>
                </Touchable>
              );
            } else {
              return (
                <Touchable
                  key={i}
                  activeOpacity={0.8}
                  currentTab={tabState}
                  onPress={() => {
                    setCategory(e.type);
                    setTabState(e.type);
                  }}>
                  <Text>{e.name}</Text>
                </Touchable>
              );
            }
          })}
      </ScrollView>
    </Container>
  );
};

export default HeaderCategoryTab;
