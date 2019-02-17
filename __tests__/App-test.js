import 'react-native';
import React from 'react';
import { AsyncStorage as nativeStorage } from 'react-native'
import FoodListScreen from "../screens/FoodListScreen";

import Enzyme from 'enzyme';
import {shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16.3';

import fetchMock from 'fetch-mock';
import MockAsyncStorage from 'mock-async-storage';

Enzyme.configure({ adapter: new Adapter() });

fetchMock.get('*', JSON.stringify([
  {
    "id": 1,
    "name": "Karma canteen",
    "latitude": 59.330596,
    "longitude": 18.0560967,
    "following": false
  },
  {
    "id": 2,
    "name": "Teaterbaren",
    "latitude": 59.332147,
    "longitude": 18.065075,
    "following": true
  },
]));

jest.mock('AsyncStorage', () => new MockAsyncStorage());

describe('App snapshot', () => {
  it('resets locations to not followed by default', async () => {
    const wrapper = shallow(<FoodListScreen />);
    await wrapper.instance().componentDidMount();
    expect(wrapper.state('locations')[0].following).toMatchSnapshot();
    expect(wrapper.state('locations')[1].following).toMatchSnapshot();
  });
  it('calculates distances from HQ for each location', async () => {
    const wrapper = shallow(<FoodListScreen />);
    await wrapper.instance().componentDidMount();
    expect(wrapper.state('locations')[0].distanceFromHQ).toMatchSnapshot();
    expect(wrapper.state('locations')[1].distanceFromHQ).toMatchSnapshot();
  });

  it('handles already followed locations', async () => {
    await nativeStorage.setItem('followedLocations', JSON.stringify([{id: 2, following: true}]));
    const wrapper = shallow(<FoodListScreen />);
    await wrapper.instance().componentDidMount();
    expect(wrapper.state('locations')[1].following).toMatchSnapshot();
  });
});
