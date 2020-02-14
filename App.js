import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient, InMemoryCache, HttpLink } from 'apollo-client-preset';
import PokemonList from './src/screens/list-pokemon'
import PokemonDetail from './src/screens/detail-pokemon'


const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'https://graphql-pokemon.now.sh'
  })
})


const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <ApolloProvider client={client}>
        <Stack.Navigator>
          <Stack.Screen
            name="PokemonList"
            component={PokemonList}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PokemonDetail"
            component={PokemonDetail}
            options={{
              headerTransparent: true,
              title: '',
              headerShown: false
            }}
          />
        </Stack.Navigator>
      </ApolloProvider>
    </NavigationContainer>
  );
}

export default App;