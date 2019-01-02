import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import Button from '../../appet/Button';
import Theme from '../../../theme/Theme';

export default class Home extends React.Component {
  static navigationOptions = {
    headerTransparent: true,
  };

  render() {
    return (
      <View style={styles.container}>
        <Image source={require('./../../../assets/dog.png')} style={styles.icon} />
        <Text style={styles.title}>Appet</Text>
        <Text style={styles.welcomeMessage}>Encontre o seu melhor amigo aqui!</Text>
        <View style={styles.buttonsContainer}>
          <View style={styles.buttonView}>
            <Button style={styles.button} text='cadastrar-se' onPress={() => this.props.navigation.navigate('SignUp')} />
          </View>
          <View style={styles.buttonView}>
            <Button text='entrar' onPress={() => this.props.navigation.navigate('App')} />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.COLORS[4],
  },
  icon: {
    width: 150,
    height: 150,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Theme.COLORS[0],
  },
  buttonsContainer: {
    width: "70%",
    margin: 5,
  },
  buttonView: {
    marginVertical: 5,
  },
  welcomeMessage: {
    fontSize: 15,
    textAlign: 'center',
    margin: 10,
    color: Theme.COLORS[0],
  },
});