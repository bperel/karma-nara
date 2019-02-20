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
      .then(() => AsyncStorage.getItem('followedLocations'))
      .then(followedLocations => {
        let followedLocationIds = (JSON.parse(followedLocations) || []).map(followedLocation => followedLocation.id);
        this.setState(prevState => (
          {...prevState, locations: prevState.locations.map(location => (
            {...location, following: followedLocationIds.includes(location.id)}
          ))}
        ));
      })
      .finally(() => {
        this.setState({isLoadingComplete: true});
      })
  );

  componentDidMount() {
    return this.fetchAndBuildLocations()
  }

  toggleFollowFoodPlace(foodPlace) {
    this.setState(prevState => {
      prevState.locations.filter(location => location.id === foodPlace.id)[0].following = !foodPlace.following;
      AsyncStorage.setItem('followedLocations', JSON.stringify(this.state.locations.filter(location => !!location.following)));
      return prevState;
    });
  }

  isFollowing = locationId => !!this.state.locations.filter(location => location.id === locationId)[0].following;

  render() {
    return (
      <ScrollView style={styles.container}>
        {!this.state.isLoadingComplete && <ActivityIndicator size="large" color="#0000ff" />}
        {this.state.isLoadingComplete && <FlatList
          style={styles.flatlist}
          keyExtractor={foodPlace => foodPlace.id.toString()}
          data={this.state.locations}
          renderItem={({item: foodPlace}) =>
            <View style={styles.flatlistItem}>
              <View style={styles.follow}>
                <Button color={this.isFollowing(foodPlace.id) ? Colors.followButtonSelected : Colors.followButtonDefault}
                  title={ this.isFollowing(foodPlace.id) ? "Followed" : "Follow"}
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
