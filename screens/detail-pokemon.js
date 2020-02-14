import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ActivityIndicator,
  Platform
} from 'react-native'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTheme } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';

const Tab = createMaterialTopTabNavigator();


const { width, height } = Dimensions.get('window')

const query = gql`
    query ($name: String!) {
        pokemon(name:$name) {
            name   
            classification
            image
            types
            resistant
            weaknesses
            evolutions {
                name
                image
                types
           }
          }
        }`

const elementColor = (type) => {
  if (type === "Water") {
    return '#78BDFF'
  } else if (type === "Grass") {
    return '#27AE60'
  } else if (type === "Fire") {
    return '#C0392B'
  } else if (type === "Poison") {
    return '#8e44ad'
  } else if (type === "Normal") {
    return '#6C7A89'
  } else if (type === "Ghost") {
    return '#2C3E50'
  } else if (type === "Electric") {
    return '#F4D03F'
  } else if (type === "Ice") {
    return '#5DADE2'
  } else if (type === "Ground") {
    return '#935116'
  } else if (type === "Rock") {
    return '#616A6B'
  }
  else {
    return '#DC7633'
  }
}


const DetailPoke = ({ route }) => {
  const { pokemon } = route.params
  const { loading, error, data } = useQuery(query, {
    variables: { name: pokemon.name },
  });
  console.log(data);

  if (loading) {
    return <View style={styles.loading}>
      <ActivityIndicator />
    </View>
  } else if (error) {
    return <View>
      <Text>error</Text>
    </View>
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <View style={styles.detailWrapper}>
        <View>
          <Text style={styles.namePoke}>{data.pokemon.name}</Text>
          {
            pokemon.types.map((item, index) => {
              return (
                <View key={index} style={[styles.typeContainer, { backgroundColor: elementColor(item) }]}>
                  <Text style={styles.type}>{item}</Text>
                </View>
              )
            })
          }
        </View>
        <View style={styles.imageWrapper}>
          <Image
            style={styles.imagePoke}
            source={{ uri: data.pokemon.image }} />
          <Text style={styles.classf}>{data.pokemon.classification}</Text>
        </View>
      </View>

      <View style={styles.wrapperDetail}>
        <Text style={styles.label}>resistant</Text>
        <View style={styles.wrapperResis}>
          {
            data.pokemon.resistant.map((item, index) => {
              return (
                <View style={{ flexDirection: 'row' }} key={index}>
                  <Text style={[styles.resistantMode, { backgroundColor: elementColor(item) }]}>{item}</Text>
                </View>
              )
            })
          }
        </View>

        <Text style={styles.label}>weaknesses</Text>
        <View style={styles.wrapperResis}>
          {
            data.pokemon.weaknesses.map((item, index) => {
              return (
                <View style={{ flexDirection: 'row' }} key={index}>
                  <Text style={[styles.resistantMode, { backgroundColor: elementColor(item) }]}>{item}</Text>
                </View>
              )
            })
          }
        </View>

        <Text style={styles.label}>evolutions</Text>
        <View style={styles.wraperEvolu}>
          {
            data.pokemon.evolutions ?
              data.pokemon.evolutions.map((item, index) => {
                return (
                  <View key={index} style={{ flexDirection: 'column' }}>
                    <View style={{ flexDirection: 'column' }}>
                      <Image style={styles.imageEvolu} source={{ uri: item.image }} />
                      <Text style={styles.nameEvolu}>{item.name}</Text>
                    </View>
                  </View>
                )
              })
              : null
          }
        </View>
      </View>
    </ScrollView >
  )
}

export default DetailPoke

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    padding: 20
  },
  loading: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center'
  },
  imagePoke: {
    width: width / 2,
    height: width / 2.5,
    resizeMode: 'contain'
  },
  namePoke: {
    fontWeight: 'bold',
    fontSize: 26,
    marginBottom: 20
  },
  detailWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  typeContainer: {
    paddingVertical: 2,
    borderRadius: 360,
    marginVertical: 3,
  },
  type: {
    color: '#fff',
    textAlign: 'center',
    padding: 4
  },
  imageWrapper: {
    alignSelf: 'center',
    justifyContent: 'center'
  },
  classf: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 20,
    fontSize: 26
  },
  label: {
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 20,
    marginBottom: 10
  },
  wrapperDetail: {
    marginTop: 20
  },
  resistantMode: {
    paddingVertical: 5,
    fontWeight: 'bold',
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 20,
    borderRadius: 360,
    color: '#fff'
  },
  wrapperResis: {
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  imageEvolu: {
    width: width / 2,
    height: width / 2.5,
    resizeMode: 'contain'
  },
  nameEvolu: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20
  },
  wraperEvolu: {
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 30
  }
})

