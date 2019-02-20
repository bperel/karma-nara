import React from 'react';
import {Image, SectionList, StyleSheet, Text, View} from "react-native";
import {Constants} from "expo";

const ListHeader = () => {
  const { manifest } = Constants;

  return (
    <View style={styles.titleContainer}>

      <View style={styles.titleIconContainer}>
        <AppIconPreview iconUrl={manifest.iconUrl} />
      </View>

      <Text style={styles.nameText} numberOfLines={1}>
        {manifest.name}
      </Text>
    </View>
  );
};
const AppIconPreview = ({ iconUrl }) => (
    <Image
        source={{ uri: iconUrl }}
        style={{ width: 64, height: 64 }}
        resizeMode="cover"
    />
);

export default class AboutScreen extends React.Component {
  static navigationOptions = {
    title: 'About this app',
  };

  render() {
    const sections = [
      { data: ['Bon appétit!'] },
    ];
    return <View style={styles.container}>
      <ListHeader />
      <SectionList
        contentContainerStyle={styles.listView}
        renderItem={({item}) => <Text style={styles.section}>{item}</Text>}
        stickySectionHeadersEnabled={true}
        keyExtractor={(item, index) => index}
        sections={sections}
      />
    </View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 15,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  titleIconContainer: {
    marginRight: 15,
    paddingTop: 2,
  },
  nameText: {
    fontWeight: '600',
    fontSize: 18,
  },
  listView: {
    flex: 1,
    alignItems: 'center',
  },
  section: {
    paddingTop: 15,
    fontSize: 24
  }
});