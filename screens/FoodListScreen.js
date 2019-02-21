import React from 'react';
import Geo from '../lib/Geo';
import { ScrollView, StyleSheet, ActivityIndicator, FlatList, View, Text, Button, AsyncStorage } from 'react-native';
import Colors from '../constants/Colors';
import Coordinates from "../constants/Coordinates";

export default class FoodListScreen extends React.Component {
  static navigationOptions = {
    title: 'Karma nära',
  };

  state = {
    isLoadingComplete: false,
    locations: [],
    followedLocations: []
  };

  fetchAndBuildLocations = () => (
    fetch(Coordinates.foodPlaceListUrl)
      .then((response) => response.json())
      .then((responseJson) => {
        let locations = responseJson
          .map(location => (
            {...location, distanceFromHQ: Geo.getDistanceFromKarmaHQ(location), following: false}
          ))
          .sort((location1, location2) => (
            location1.distanceFromHQ < location2.distanceFromHQ ? -1 : (location1.distanceFromHQ > location2.distanceFromHQ ? 1 : 0)
          ));
        this.setState({locations});
      })
      .catch((error) => {
        console.error(error);
      })
      .then(() => AsyncStorage.getItem('followedLocationIds'))
      .then(followedLocations => {
        this.setState({followedLocations: JSON.parse(followedLocations) || {}});
      })
      .finally(() => {
        this.setState({isLoadingComplete: true});
      })
  );

  componentDidMount() {
    return this.fetchAndBuildLocations()
  }

  toggleFollowFoodPlace(foodPlace) {
    let followedLocations = this.state.followedLocations;
    followedLocations[foodPlace.id] = !followedLocations[foodPlace.id];
    this.setState({followedLocations});

    AsyncStorage.setItem('followedLocationIds', JSON.stringify(followedLocations));
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        {!this.state.isLoadingComplete && <ActivityIndicator size="large" color="#0000ff" />}
        {this.state.isLoadingComplete && <FlatList
          style={styles.flatlist}
          keyExtractor={foodPlace => foodPlace.id.toString()}
          data={this.state.locations}
          extraData={this.state}
          renderItem={({item: foodPlace}) =>
            <View style={styles.flatlistItem}>
              <View style={styles.follow}>
                <Button color={this.state.followedLocations[foodPlace.id] ? Colors.followButtonSelected : Colors.followButtonDefault}
                        title={ this.state.followedLocations[foodPlace.id] ? "Followed" : "Follow"}
                        onPress={() => { this.toggleFollowFoodPlace(foodPlace) }} />
              </View>
              <View style={styles.foodPlaceInfo}>
                <Text style={styles.name}>{foodPlace.name}</Text>
                <Text style={Geo.getProximityStyle(foodPlace.distanceFromHQ)}>{foodPlace.distanceFromHQ} meters away</Text>
              </View>
            </View>
          }
        />}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  flatlist: {
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 25,
    paddingRight: 25,
    overflow: 'scroll',
  },
  flatlistItem: {
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 2,
  },
  follow: {
    width: 100,
  },
  foodPlaceInfo: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  name: {
    fontSize: 18,
  },
});
