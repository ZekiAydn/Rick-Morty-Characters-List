import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity, ImageBackground
} from 'react-native';
import axios from 'axios';

interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  image: string;
}

const App: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [filtered, setFiltered] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCharacters = () => {
    setLoading(true);
    axios.get('https://rickandmortyapi.com/api/character')
        .then(response => {
          setCharacters(response.data.results);
          setLoading(false);
        })
        .catch(error => {
          console.error(error);
          setLoading(false);
        });
  };

  useEffect(() => {
    fetchCharacters();
  }, []);

  const toggleFilter = () => {
    if (filtered) {
      // Filtre aktifken tıklanırsa, tüm karakterleri tekrar getir
      fetchCharacters();
      setFiltered(false);
    } else {
      // Filtre pasifken tıklanırsa, sadece erkek ve canlı olanları göster
      const filteredCharacters = characters.filter(character =>
          character.gender === 'Male' && character.status === 'Alive'
      );
      setCharacters(filteredCharacters);
      setFiltered(true);
    }
  };

  const truncateName = (name: string, maxLength: number) => {
    if (name.length > maxLength) {
      return name.substring(0, maxLength) + '...';
    }
    return name;
  };

  const renderItem = ({ item }: { item: Character }) => (
      <TouchableOpacity style={styles.characterCard}>
        <View style={styles.chartInside}>
        <Image source={{ uri: item.image }} style={styles.image} />
          <Text style={styles.name}>
            {truncateName(item.name, 20)}
          </Text>
        </View>
        <Text style={styles.details}>{item?.status} - {item?.gender}</Text>
      </TouchableOpacity>
  );

  return (
      <ImageBackground style={styles.background} source={require('./assets/image/background.jpg')}>
      <View style={styles.container}>
        <Text style={styles.headerText}>Rick & Morty Characters List</Text>
        <TouchableOpacity
            style={[styles.filterButton, filtered ? styles.activeButton : styles.inactiveButton]}
            onPress={toggleFilter}
        >
          <Text style={filtered ? styles.activeButtonText : styles.inactiveButtonText}>
            {filtered ? "Reset Filter" : "Filter Male & Alive"}
          </Text>
        </TouchableOpacity>
        {loading ? (
            <ActivityIndicator size="large" color="#0000ff"/>
        ) : (
            <FlatList
                showsVerticalScrollIndicator={false}
                data={characters}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.list}
            />
        )}
      </View>
      </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop:45,
    flex: 1,
    padding: 10,
  },
  background:{
    flex:1,
    width:'100%',
    height:'100%',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    marginVertical: 20,
  },
  list: {
    marginTop: 10,
  },
  filterButton: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#636363',
  },
  inactiveButton: {
    backgroundColor: '#fff',
  },
  activeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  inactiveButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  characterCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#97FB9B',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
    elevation: 5,
  },
  chartInside:{
    flexDirection:'row',
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 25,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  details: {
    fontSize: 14,
    color: '#666',
  },
});

export default App;
