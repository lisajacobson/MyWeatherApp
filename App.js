<script src="http://localhost:8097"></script>

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, ScrollView, View, TextInput, Button, Image, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { FontAwesome } from '@expo/vector-icons';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'steelblue',
    width: '100%',
    height: '100%',
    padding: 15
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  title: {
    color: 'white',
    fontStyle: 'bold',
    fontSize: 30,
    paddingTop: 15,
    paddingBottom: 15
  },
  icon: {

  },
  bar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  input: {
    margin: 15,
    height: 34,
    color: 'white',
    flex: 1
  },
  search: {
   color: 'darkslategrey',
   justifyContent: 'center',
   height: 34
  },
  output: {
    fontSize: 18,
    zIndex: 99,
    color: 'white',
    marginBottom: 10,
    width: '100%',
    width: 250
  },
  img: {
    height: 64,
    width: 64,
    margin: 5
  },
  images: {
    flexDirection: 'column'
  },
  weather: {
    flexDirection: 'row'
  },
  forecast: {
    color: 'white',
    fontSize: 18,
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  date: {
    color: 'white',
    fontSize: 14,
    marginLeft: 5,
    paddingTop: 13
  }
});

function HomeScreen({ navigation }) {
  const [data, setData] = useState('');
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('20005');
  const [isLoading, setIsLoading] = useState(false);

  const icon = data.condition ? (data.condition.icon).substring(2) : '';
  const img_url = `http://${icon}`;

  useEffect(() => {
    setIsLoading(true),
    fetch(`http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${search}`)
        .then(res => res.json())
        .then(response =>
          setData(response.current),
          setIsLoading(false)
        )}, [search],

    // fetchForecast = async () => {
    //   await fetch
    // }
    
    );

  return (
    <ScrollView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>What's My Outlook?</Text>
            <Feather style={styles.icon} name="sunrise" size={60} color="gold" />
          </View>
          <View style={styles.bar}>
            <TextInput
            value={query}
            style={styles.input}
            placeholder="Enter zip code to get your weather!"
            placeholderTextColor="white"
            onChange={event => setQuery(event.target.value)}
          />
        <Button 
          disabled={ query.length < 5 } 
          keyboardType={'numeric'}
          disabledStyle={{color: 'black'}} 
          style={styles.search} 
          onPress={() => {setSearch(query)}} 
          title="Search"
          disabledStyleText="Enter a zip code">
        </Button>
      </View>
      {isLoading ? (
        <ActivityIndicator></ActivityIndicator>
      ) : (
      <View style={styles.weather}>
      <View styles={styles.images}>
      <Image source={{ uri: img_url }} style={{height: 64, width: 64}}/>
      {data.condition && (data.condition.text.includes('sunny')  || data.condition.text.includes('Partly') ? <FontAwesome name="smile-o" size={64} color="white" /> : <FontAwesome name="frown-o" size={64} color="white" />)}
      </View>  
        <View style={styles.textResults}>
          <Text style={styles.output}>
            Current Temp: {data.temp_f}°F {data.condition ? <Text>and {(data.condition.text).charAt(0).toLowerCase() + (data.condition.text).substring(1)}</Text> : ''} but it feels like {data.feelslike_f}°F.
          </Text>
          <Text style={styles.output}>There are winds at {data.wind_mph} mph coming from the {data.wind_dir}.</Text>
          <Text style={styles.output}>The Humidity is {data.humidity}% and cloud cover is at {data.cloud}%.</Text>
          <Text style={styles.output}>There {data.precip_in < .01 ? 'is' : 'are'} currently {data.precip_in} inches of precipitation.</Text>
          <Text style={styles.output}>The UV Index is {data.uv} and visibility is {data.vis_miles}. </Text>
        </View>
      </View>)}
      </ScrollView>
  );
}

function Forecast ({ navigation }) {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('20005');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true),
    fetch(`https://api.weatherbit.io/v2.0/forecast/daily?units=I&postal_code=${search}&key=${WEATHERBIT_API_KEY}`)
    .then(res => res.json())
      .then(response =>
        setData(response.data),
        setIsLoading(false)
      )
  }, [search]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>What's My Outlook?</Text>
        <Feather style={styles.icon} name="sunrise" size={60} color="gold" />
      </View>
      <View style={styles.bar}>
        <TextInput
        value={query}
        style={styles.input}
        placeholder="Enter zip code to get your weather!"
        placeholderTextColor="white"
        onChange={event => setQuery(event.target.value)}
      />
      <Button 
        disabled={ query.length < 5 } 
        keyboardType={'numeric'}
        disabledStyle={{color: 'black'}} 
        style={styles.search} 
        onPress={() => {setSearch(query)}} 
        title="Search"
        disabledStyleText="Enter a zip code">
      </Button>
      </View>
      {isLoading ? (
        <ActivityIndicator></ActivityIndicator>
      ) : (
      <View style={styles.forecast}>
        {data.slice(0, 5).map(d => 
          <>
          <View style={styles.weather}>
            <Text style={styles.date}>{(d.datetime).slice(6,10)}</Text>
            <View style={styles.images}>
              <Image source={{ uri: `https://www.weatherbit.io/static/img/icons/${d.weather.icon}.png` }} style={{height: 64, width: 64}}/>
            </View>
            <Text style={styles.output}>{d.weather.description}: high of {d.high_temp}°F, low of {d.low_temp}°F</Text>
          </View>
          </>
        )}
      </View>
      )}
    </ScrollView>
  );
}

function Alert({ navigation }) {
  const [data, setData] = useState();
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('12861');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true),
    fetch(`http://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${search}&days=3`)
    .then(res => res.json())
      .then(response =>
        setData(response.alert),
        setIsLoading(false)
      )
  }, [search]);
  

  return (
    <ScrollView style={styles.container}>
    <View style={styles.header}>
      <Text style={styles.title}>What's My Outlook?</Text>
      <Feather style={styles.icon} name="sunrise" size={60} color="gold" />
    </View>
    <View style={styles.bar}>
      <TextInput
      value={query}
      style={styles.input}
      placeholder="Enter zip code to get your weather!"
      placeholderTextColor="white"
      onChange={event => setQuery(event.target.value)}
    />
  <Button 
    disabled={ query.length < 5 } 
    keyboardType={'numeric'}
    disabledStyle={{color: 'black'}} 
    style={styles.search} 
    onPress={() => {setSearch(query)}} 
    title="Search"
    disabledStyleText="Enter a zip code">
  </Button>
</View>
{isLoading ? (
  <ActivityIndicator></ActivityIndicator>
) : (
<View style={styles.forecast}>

{console.log(data)}
<Text style={styles.output}>{ (data && Object.keys(data).length !== 0) ? <Text>{data.note} + ' effective ' + {data.effective} + ' and expires at ' + {data.expires}</Text>  : <Text>No weather alerts at this time</Text>}</Text>
</View>)}
  </ScrollView>
  );
}

function Logo() {
  return (
    <Feather name="sunrise" size={45} color="gold" style={{ marginRight: 15 }}/>
  );
}

  const Stack = createStackNavigator();
  const Tab = createBottomTabNavigator();

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({focused, name, size, color }) => {
          // let iconName;
        
          if (route.name === 'Home') {
            return <MaterialCommunityIcons name={'calendar-star'} size={24} color={color} />
          } else if (route.name === 'Forecast') {
            return <MaterialCommunityIcons name={'calendar-clock'} size={24} color={color} />
          } else {
            return <MaterialCommunityIcons name={'calendar-question'} size={24} color={color} />
          }
          return <MaterialCommunityIcons name={name} size={size} color={color} />
        },
      })}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'grey',
      }}>
        <Tab.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ 
            title: 'Today',
            headerStyle: {
              backgroundColor: 'navy',
              opacity: .8
            },
            headerTintColor: 'white',
            headerTitleStyle: {
              color: 'white',
              fontWeight: 'bold'
            },
            headerRight: props => <Logo { ...props } />,
          }}  
        >
    </Tab.Screen>
    <Tab.Screen name='Forecast' component={Forecast} />
    <Tab.Screen name='Alerts' component={Alert} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
