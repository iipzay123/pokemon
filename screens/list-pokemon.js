import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
  TouchableOpacity
} from 'react-native'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import CardView from "react-native-cardview"
import { useNavigation } from '@react-navigation/native'
const { width, height } = Dimensions.get('window')
const API_TYPE_URL = 'https://pokeapi.co/api/v2/type'

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


const query = gql`
    query ($limit: Int!) {
        pokemons(first: $limit) {
            name
            image
            types
            number
        }
    }
`

const ListItems = ({ item }) => {
  const navigation = useNavigation()
  return <TouchableOpacity activeOpacity={1} style={styles.listItemContainer} onPress={() => navigation.navigate('PokemonDetail', {
    pokemon: item
  })}>
    <CardView
      style={styles.cardContainer}
      cardElevation={3}
      cardMaxElevation={2}
      cornerRadius={15}>
      <View>
        <Text style={styles.pokemonName}>{item.name}</Text>
        <View style={[styles.typeContainer, { backgroundColor: elementColor(item.types[0]) }]}>
          <Text style={styles.type}>{item.types[0]}</Text>
        </View>
        {item.types.length > 1 ? <View style={[styles.typeContainer, { backgroundColor: elementColor(item.types[1]) }]}>
          <Text style={styles.type}>{item.types[1]}</Text>
        </View> : null}
      </View>
      <Image style={styles.pokemonImage}
        source={{ uri: item.image }} />
    </CardView>
  </TouchableOpacity>
}

const Loadings = () => {
  return <View style={styles.loading}><ActivityIndicator /></View>
}

const Title = () => {
  return <Text style={styles.Title}>Pokemon</Text>
}

const List = ({ data, fetchMore, limit, setLimit, isLoadingMore, setLoadingMore, refetch }) => {

  return <FlatList
    data={data}
    showsVerticalScrollIndicator={false}
    numColumns={2}
    renderItem={({ item }) => <ListItems item={item} loading={isLoadingMore} />}
    keyExtractor={(_, index) => index.toString()}
    onEndReached={() => {
      setLimit(limit + 10)
      if (!isLoadingMore) {
        setLoadingMore(true)
        fetchMore({
          variables: {
            limit: limit + 10
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            setLoadingMore(false)
            if (!fetchMoreResult) return prev;
            return Object.assign(prev, {
              pokemons: [...fetchMoreResult.pokemons]
            });
          }
        })
      }

    }}
    ListHeaderComponent={() => <Title />}
    ListFooterComponent={() => isLoadingMore && data.length > 10 ?
      <Loadings /> : null}
  />
}

const PokeList = () => {
  const [limit, setLimit] = useState(10)
  const [isLoadingMore, setLoadingMore] = useState(false)
  const { loading, error, data, fetchMore, refetch } = useQuery(query, {
    variables: { limit: 30 },
  });

  const [listType, setListType] = useState()

  async function getElementPoke() {
    try {
      let response = await fetch(
        API_TYPE_URL,
      );
      let responseJson = await response.json();
      setListType(responseJson.results)
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getElementPoke()
  })

  const Content = () => {
    if (loading) {
      return <View style={styles.loadingContainer}><ActivityIndicator /></View>
    } else if (error) {
      return <View style={styles.container}>
        <Text style={styles.error}>Error</Text>
      </View>
    }
    return <View style={styles.container}>
      <View style={styles.foregroundContainer}>
        <List
          data={data.pokemons}
          loading={loading}
          fetchMore={fetchMore}
          setLimit={setLimit}
          limit={limit}
          isLoadingMore={isLoadingMore}
          setLoadingMore={setLoadingMore}
          refetch={refetch}
        />
      </View>
    </View>
  }

  return <View style={styles.stackContainer}>
    {Content()}
  </View>

}

export default PokeList;

const styles = StyleSheet.create({
  stackContainer: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  backgroundImage: {
    opacity: 0.1,
    width,
    height: height / 1,
    position: 'absolute',
    right: - (width / 5),
    top: - (width / 1.63)
  },
  foregroundContainer: {
    position: 'absolute',
    width,
    height,
    top: 0,
    left: 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 10,
    justifyContent: 'center'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ffffff'
  },
  listItemContainer: {
    flex: 1,
    margin: 10,
    borderRadius: 15
  },
  cardContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10
  },
  pokemonImage: {
    height: width / 2.5,
    width: width / 5,
    resizeMode: 'contain'
  },
  typeContainer: {
    marginTop: 10,
    padding: 5,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  pokemonName: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: 'bold'
  },
  type: {
    color: '#fff',
    marginHorizontal: 10
  },
  loading: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  Title: {
    fontSize: 35,
    fontWeight: 'bold',
    marginTop: width / 6,
    marginBottom: 25,
    marginLeft: 10
  },
  filterItem: {
    borderRadius: 20,
    backgroundColor: '#ffffff',
    padding: 5,
    borderWidth: 1,
    borderColor: 'gray',
    width: 100,
    marginHorizontal: 5,
    marginVertical: 10,
    alignItems: 'center',

  },
  filterContainer: {
    flex: 1,
    marginTop: 20,
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  filterTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center'
  },
  filterItemTitle: {
  },
  error: {
    textAlign: 'center'
  }
})