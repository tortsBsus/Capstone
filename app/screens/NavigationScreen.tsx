import React, { FC, useState, useEffect } from "react"
import { TextStyle, ViewStyle, StyleSheet, View, Dimensions, Button, TextInput, KeyboardAvoidingView, Platform } from "react-native"
import { Card, Screen, Text, TextField } from "../components"
import { DemoTabScreenProps } from "../navigators/DemoNavigator"
import { spacing } from "../theme"
import MapView, { Callout, Marker, Polyline } from 'react-native-maps';
import { getRouteCoordinate, getAlternativeRouteCoordinates, fetchPlaceDetails } from "../GoogleAPI"
import { isCoordinateSafe, routeRating, safetyRatingRoutes } from "app/SafetyScore"
import Constants from "expo-constants";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';



export const NavigationScreen: FC<DemoTabScreenProps<"Navigate">> = function NavigationScreen(
  _props,
) {
  const [mapRegion, setMapRegion] = useState({
    latitude: 12.848060290069618, 
    latitudeDelta: 0.021698091960084653, 
    longitude: 77.66496514901519, 
    longitudeDelta: 0.02072509378194809
  });

  // {latitude: 12.84871, longitude: 77.657882}
  let [source_coord, setSourceCoord] = React.useState(null);
  // {latitude: 12.843911, longitude: 77.671369}
  let [destination_coord, setDestCoord] = React.useState(null);

  const [route, setRoute] = React.useState([]);

  const [alternativeRoutes, setAlternativeRoute] = React.useState([]);
  const colors = ["#0000FF","#A2A0A0","#A2A0A0","#A2A0A0","#A2A0A0"];
  const width = [6,3,3,3,3];
  
  const fetchData = async () => {
    try {
      const polyline = require('@mapbox/polyline');
      const origin = { lat: source_coord.latitude, lng: source_coord.longitude };
      const destination = { lat: destination_coord.latitude, lng: destination_coord.longitude }; 
      const allRouteCoordinates = await getAlternativeRouteCoordinates(origin, destination);
      var decoded_routes = [];
      for (var i = 0; i < allRouteCoordinates.length; i++) {
        const decoded_route = polyline.decode(allRouteCoordinates[i]);
        decoded_routes.push(decoded_route);
        // console.log("route", i+1, ":", decoded_route);
      }
      const convertedCoordinates = decoded_routes.map(subArray => subArray.map(innerArray => ({
        latitude: innerArray[0],
        longitude: innerArray[1]
      })));
      const sortOrder = safetyRatingRoutes(convertedCoordinates);
      convertedCoordinates.sort((a, b) => {
        const indexA = sortOrder[convertedCoordinates.indexOf(a)];
        const indexB = sortOrder[convertedCoordinates.indexOf(b)];
        return indexB - indexA;
      });
      setAlternativeRoute(convertedCoordinates);      // SAFEST route in the front
      console.log(convertedCoordinates);
    } catch (error) {
      console.error('Error in fetching alternativeRouteCoordinates:', error);
    }
  };

  const [marker, setMarker] = React.useState<boolean>(false);

  const handleSubmit = () => {
    setReceivedSubmit(true);
    if (source_coord == null) { 
      console.log("Source Address REQUIRED.") 
    } else if (destination_coord == null) { 
      console.log("Destination Address REQUIRED.") 
    } else {
      console.log("SOURCE      : ", source_coord);
      console.log("DESTINATION : ", destination_coord);
      setMarker(true);
      fetchData();
    }
  }

  const fooFetchPlaceDetails = async (placeId) => {
    try {
      // const placeId = 'ChIJL03jEYsVrjsRD9iLq9vbSl8';
      const result = await fetchPlaceDetails(placeId);
      return result;
    } catch (error) {
      console.error('Error getting location coordinates:', error);
      return error;
    }
  }

  const handleSourceLocation = async (data) => {
    console.log("place id (SOURCE):", data.place_id);
    const coord = await fooFetchPlaceDetails(data.place_id);
    setSourceCoord(coord);
    console.log("source", source_coord);
  }

  const handleDestLocation = async (data) => {
    console.log("place id (DESTINATION):", data.place_id);
    const coord = await fooFetchPlaceDetails(data.place_id);
    setDestCoord(coord);
    console.log("destination", destination_coord);
  }

  //submit button
  const [receivedSubmit, setReceivedSubmit] = useState(false);

  useEffect(() => {
    setReceivedSubmit(false);
  }, [])
  

  return (
    <Screen preset="scroll" contentContainerStyle={$container} style={styles.container} safeAreaEdges={["top"]}>
      <Text preset="heading" tx="NavigationScreen.title" style={$title} />
      <Text tx="NavigationScreen.tagLine" style={$tagline} />
      {
        marker 
        ? 
        <MapView 
          style={styles.map} 
          region={mapRegion}
          onRegionChangeComplete={(region) => setMapRegion(region)}
        >
          <Marker coordinate={source_coord}>
            {/* <Callout> <View> <Text>{destination}</Text> </View> </Callout> */}
          </Marker>
          <Marker coordinate={destination_coord}>
            {/* <Callout> <View> <Text>{source}</Text> </View> </Callout> */}
          </Marker>
          {/* <Polyline
            coordinates={route}
            strokeColor="#0000FF"
            strokeWidth={6}
          /> */}
          {alternativeRoutes.map((route, index) => (
            <Polyline
              key={index}
              coordinates={route}
              strokeColor={colors[index]}
              strokeWidth={width[index]}
            />
          ))}
        </MapView>
        :
       
        <Text text="" style={$tagline} />
      //  <MapView 
      //     style={styles.map} 
      //     region={mapRegion}
      //     onRegionChangeComplete={(region) => setMapRegion(region)}
      //   /> 
      }
      <KeyboardAvoidingView>
        <View style = {styles.searchContainer}>
          <Text preset="bold" tx="NavigationScreen.sourceInput" style={$inputTitle} />
          <GooglePlacesAutocomplete
            styles = {{textInput: styles.input}}
            placeholder='Enter Starting point'
            textInputProps={{
              selectTextOnFocus: true,
            }}
            onPress={handleSourceLocation}
            query={{
              key: 'AIzaSyCvZ7sW6G28tDmOE4RX7h9-PGnI5M7WkFY',
              language: 'en',
            }}
          />

          <Text preset="bold" tx="NavigationScreen.destInput" style={$inputTitle} />
          <GooglePlacesAutocomplete
            styles = {{textInput: styles.input}}
            placeholder='Enter Ending point'
            textInputProps={{
              selectTextOnFocus: true,
            }}
            onPress={handleDestLocation}
            query={{
              key: 'AIzaSyCvZ7sW6G28tDmOE4RX7h9-PGnI5M7WkFY',
              language: 'en',
            }}
          />
          <Button
            onPress={handleSubmit}
            title="Get Directions"
            color="#00204f"
            accessibilityLabel="Submit Source & Destination addresses"
          />
        </View>        
      </KeyboardAvoidingView>
    </Screen>
  )
}

const styles = StyleSheet.create({  
  container: {
  },
  map: {
    height: '50%',
    width: '100%',
    paddingTop: spacing.large + spacing.extraLarge,
    paddingHorizontal: spacing.large,
    // marginBottom: spacing.large + spacing.extraLarge
  },
  input: {
    backgroundColor: "#ded9db",
    color: "#00204f",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: spacing.medium,
    textAlign:"left"
  },
  searchContainer: {
    position: "absolute",
    width: "100%",
    shadowColor: "transparent",
    elevation: 4,
    padding: 8,
    marginTop: spacing.small
  },
});

const $container: ViewStyle = {
  flex: 1, 
  // justifyContent: 'center',
  height:"100%",
  paddingTop: spacing.large,
  paddingHorizontal: spacing.large,
}

const $title: TextStyle = {
  // marginBottom: spacing.small,
  fontSize: spacing.large + spacing.tiny
}

const $tagline: TextStyle = {
  fontSize: 14,
  marginBottom: spacing.large,
}

const $inputTitle: TextStyle = {
  marginBottom: "1%",  
  // fontWeight: "bold",
}
