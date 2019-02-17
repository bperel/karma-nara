import React from 'react';
import {Image, SectionHeader, SectionList, StyleSheet, Text, View} from "react-native";
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
    const { manifest } = Constants;
    const sections = [
      { data: [{ value: manifest.sdkVersion }], title: 'sdkVersion' },
    ];
    return <SectionList
        style={styles.container}
        renderItem={item => <Text>{item.value}</Text>}
        renderSectionHeader={this._renderSectionHeader}
        stickySectionHeadersEnabled={true}
        keyExtractor={(item, index) => index}
        ListHeaderComponent={ListHeader}
        sections={sections}
    />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  titleContainer: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 15,
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
  }
});