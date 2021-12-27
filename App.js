import React, { Component } from 'react';
import {
  ActivityIndicator,
  Button,
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput
} from 'react-native';
import Constants from 'expo-constants';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem, } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Input } from 'react-native-elements';


import AsyncStorage from '@react-native-async-storage/async-storage';

import Icon from 'react-native-vector-icons/FontAwesome';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="World Stats" component={World} />
      <Drawer.Screen name="Countries Stats" component={Stack_Nav} />
   <Drawer.Screen name="Favourite Countries" component={F_Countries} />
    </Drawer.Navigator>
  );
}

function Stack_Nav() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Countries" component={Countries} />
      <Stack.Screen name="Country Details" component={CountryStats} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyDrawer />
    </NavigationContainer>
  );
}
class World extends React.Component {
  state = {
    data:"loading"
  }
  componentDidMount(){
fetch("https://covid-19-data.p.rapidapi.com/totals", {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "covid-19-data.p.rapidapi.com",
		"x-rapidapi-key": "cb9a2c809emshcd1af56b862accap1385efjsn6cff48ee2c3a"
	}
})
      .then((response) => response.json())
      .then((responseJson) => {
       this.setState({data:responseJson})
      })
      .catch((error) => {
        console.error(error);
      });
  }
 render(){
    return (
      
    <View style={styles.container}>
       <View style = {{backgroundColor:"yellow",marginBottom:30}}>
    <Text style={{textAlign:"center",fontSize:30,fontStyle:"bold"}}>COVID LATEST NEWS</Text>
    </View>
    <View style={{flexDirection:"row"}}>
      <View style = {{backgroundColor:"#fa8787",width:"50%",borderRadius:10,textAlign:"center"}}>
      <Text style={{fontSize:20}}>
        Confirmed Cases
      </Text>
      <Text>
      {this.state.data[0].confirmed}
      </Text>
      </View>

       <View style = {{backgroundColor:"#7cfc8b",width:"50%",borderRadius:10,textAlign:"center",marginLeft:5}}>
      <Text style={{fontSize:20}}>
        Recovered Cases
      </Text>
      <Text>
      {this.state.data[0].recovered}
      </Text>
      </View>
    </View>

    <View style={{flexDirection:"row",marginTop:20}}>
      <View style = {{backgroundColor:"#8d83fc",width:"50%",borderRadius:10,textAlign:"center"}}>
      <Text style={{fontSize:20}}>
        Critical Cases
      </Text>
      <Text>
      {this.state.data[0].critical}
      </Text>
      </View>

       <View style = {{backgroundColor:"#d483fc",width:"50%",borderRadius:10,textAlign:"center",marginLeft:5}}>
      <Text style={{fontSize:20}}>
      Death
      </Text>
      <Text>
      {this.state.data[0].deaths}
      </Text>
      </View>
    </View>

    <View style={{flexDirection:"row",marginTop:20}}>
      <View style = {{backgroundColor:"#ff3333",width:"100%",borderRadius:10,textAlign:"center"}}>
      <Text style={{fontSize:20}}>
          Last Updated
      </Text>
      <Text>
      {this.state.data[0].lastUpdate}
      </Text>
      </View>  
    </View>

    </View>
  );
 }
}



const CountryStats = ({ navigation, route }) => {
  const [getData, setData] = React.useState();
  const [getPop, setPop] = React.useState('Not Found');
  

  const getDataFromAPI = async () => {
    fetch(
      `https://covid-19-data.p.rapidapi.com/country?name=${encodeURIComponent(
        route.params
      )}`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-key':
            'bbc0c72044msh8ff2f36a950ab26p14e44bjsn91e599057dc9',
          'x-rapidapi-host': 'covid-19-data.p.rapidapi.com',
        },
      }
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result.confirmed);
        setData(result);
      })
      .catch((error) => {
        console.log('Error: ', error);
      });
  };

  const getDataFromAPI2 = async () => {
    fetch(
      `https://world-population.p.rapidapi.com/population?country_name=${encodeURIComponent(
        route.params
      )}`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-key':
            'bbc0c72044msh8ff2f36a950ab26p14e44bjsn91e599057dc9',
          'x-rapidapi-host': 'world-population.p.rapidapi.com',
        },
      }
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result.body.population);
        
        setPop(result.body.population);
      })
      .catch((error) => {
        console.log('Error: ', error);
      });
  };

  React.useEffect(() => {
    getDataFromAPI2();
  }, [setPop]);

  React.useEffect(() => {
    getDataFromAPI();
  }, [setData]);

   const LoadData = async () => {
    try {
      console.log('loading');
      const jsonValue = await AsyncStorage.getItem('country');
      var a = jsonValue != null ? JSON.parse(jsonValue) : [];
      console.log('loaded');
      console.log(a);
      return a;
    } catch (e) {
      // error reading value
    }
  };
  const SaveData = async (value) => {
    try {
      console.log('saving');
      var stored = await LoadData();

      stored.push(value);
      console.log(stored);
      const jsonValue = JSON.stringify(stored);
      await AsyncStorage.setItem('country', jsonValue);
      console.log('saved');
    } catch (e) {
      // saving error
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        refreshing={false}
        onRefresh={getDataFromAPI}
        keyExtractor={(item, index) => item.key}
        data={getData}
        renderItem={({ item, index }) => (
          <View>
          <View style = {{backgroundColor:"yellow"}}>
            <Text style={{textAlign:"center",fontSize:30,fontStyle:"bold"}}>
              {item.country}
            </Text>
            </View>
         <View style = {{flexDirection:"row"}}>
             <View style={[styles.card,{backgroundColor:'#fa8787'}]}>
              <Text style={styles.label}>Total Population</Text>
             <Text style={styles.label}>{getPop}</Text>           
            </View>
          <View style={[styles.card, { backgroundColor: '#7cfc8b',marginLeft:5 }]}>
           <Text style={styles.label}>Confirmed Cases</Text>
            <Text style={styles.label}>
              {item.confirmed}
            </Text>
            <Text style={styles.label}>
              {((item.confirmed / getPop) * 100).toFixed(3)}%
            </Text>
          </View>
         </View>
          <View style = {{flexDirection:"row"}}>
          <View style={[styles.card, { backgroundColor: '#8d83fc' }]}>
           <Text style={styles.label}>Recovered Cases</Text>
            <Text style={styles.label}>
                {item.recovered}
            </Text>
            <Text style={styles.label}>
              {((item.recovered / getPop) * 100).toFixed(3)}%
            </Text>
          </View>
          <View style={[styles.card, { backgroundColor: '#d483fc',marginLeft:5 }]}>
           <Text style={styles.label}>Deaths</Text>
            <Text style={styles.label}>
              {item.deaths}
            </Text>
            <Text style={styles.label}>
              {((item.deaths / getPop) * 100).toFixed(3)}%
            </Text>
          </View>
         </View>
    <View style={{flexDirection:"row",marginTop:20}}>
      <View style = {{backgroundColor:"#ff3333",width:"100%",borderRadius:10,textAlign:"center"}}>
      <Text style={{fontSize:20}}>
          Last Updated
      </Text>
      <Text>
        {item.lastUpdate}
      </Text>
      </View>  
    </View>
     <TouchableOpacity
          style={{
            padding: 5,
            borderWidth: 1,
            borderRadius: 10,
            backgroundColor: '#0F52BA',
            margin: 5,
          }}
          onPress={() => SaveData({ Country: item.country })}>
          <Text style={{ color: 'white', fontWeight: 'bold',textAlign: "center" }}>
            {' '}
            Add To Favourite
          </Text>
        </TouchableOpacity>
           
          </View>
        )}
      />
    </View>
  );
};
const Countries = ({ navigation }) => {
  const [getCountries, setCountries] = React.useState();
  const [getText, setText] = React.useState();
  const [getsearch, setsearch] = React.useState();

  const getDataFromAPI = async () => {
    fetch('https://covid-19-data.p.rapidapi.com/help/countries', {
      method: 'GET',
      headers: {
        'x-rapidapi-key': 'bbc0c72044msh8ff2f36a950ab26p14e44bjsn91e599057dc9',
        'x-rapidapi-host': 'covid-19-data.p.rapidapi.com',
      },
    })
      .then((response) => response.json())
      .then((result) => {
        var res = result.map((item) => {
          return item.name;
        });
        setCountries(res);
        setText(res);
      })
      .catch((error) => {
        console.log('Error: ', error);
      });
  };

 
  React.useEffect(
    () => {
      getDataFromAPI();
    },
    [setCountries],
    
  );

  return (
    <View>
      <TextInput
         style={{ padding: 10, borderWidth: 1, margin: 10 }}
        onChangeText={setsearch}
        value={getsearch}
        placeholder="Search Here"
      />
      <FlatList
        refreshing={false}
        onRefresh={getDataFromAPI}
        keyExtractor={(item, index) => item.key}
        data={getCountries}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={{width: '100%',paddingTop: 30,height:70,backgroundColor: '#fa8787',margin: 1,}}
            onPress={() => {
              navigation.navigate('Country Details', item);
            }}>
            <Text style = {{textAlign:"center",fontSize:20,fontWeight:800}}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};
const F_Countries = ({ navigation }) => {
const LoadData = async () => {
    try {
      console.log("loading")
      const jsonValue = await AsyncStorage.getItem('country')
      var a = jsonValue!=null?JSON.parse(jsonValue):[];
      console.log("loaded")
      console.log(a)
      console.log(country)
      setcountry(a);
      setcond(false);
      return a

    } catch(e) {
    
    }
  }
  const [country,setcountry] = React.useState([])
  const [getcond,setcond]=React.useState(true);
  const [getcondition,setcondition]=React.useState(true);

  React.useEffect(()=>{
    
  })
  
  return(
    <View>
    <Button
    title="View"
    onPress={async()=>setcountry(await LoadData())}
    />
    <TouchableOpacity
          onPress={async() => {
    AsyncStorage.clear();
    setcondition(false);
    
}}
          style={{
            padding: 5,
            alignItems:'center',
            marginLeft:80,
            marginRight:80,
            
            borderWidth: 1,
            borderRadius: 10,
            backgroundColor: '#0F52BA',
            margin: 5,
          }}
          >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>
            {' '}
            Delete All
          </Text>
        </TouchableOpacity>
    { getcondition  ? country.map((l, i) => (
      
      <ScrollView >
          <TouchableOpacity 
          style={{backgroundColor: '#ffcccb',margin: 3,padding: 10,width:'100%',alignItems:'center'}} 
          onPress={() => {
                navigation.navigate('Country Details', { country: l.Country});
              }}
          >
          <Text style={{fontWeight:'bold'}}>{l.Country}</Text>
          </TouchableOpacity>
          
          </ScrollView>
          
       
      
    )):null
  }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
   
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  card: {
    fontSize: 26,
    fontWeight: 'bold',
    padding: 8,
    borderRadius: 20,
    marginTop: 20,
  width:"50%"
  },
  label: {
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  favScreenBtns:{
    justifyContent: 'center', 
    alignItems: 'center',
    alignSelf:"center",
    backgroundColor:"#41D334",
    height:35,
    width:200,
    borderRadius:10,
    marginBottom:10,
    bottom:-400,
  }
 
});
