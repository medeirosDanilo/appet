import React, { Component } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';

import t from 'tcomb-form-native';
import { maybe, update } from 'tcomb';
import Button from '../appet/Button';
import Theme from '../../theme/Theme';
import { UFS, MANDATORY_FIELD_MESSAGE, CEP_PATH, API_PATH } from '../../constants';

const Form = t.form.Form;

const Uf = t.enums(UFS, 'Uf');

const User = t.struct({
  name: t.String,
  email: t.String,
  phoneNumber: t.String,
  birthDate: t.Date,
  cep: maybe(t.String),
  district: t.String,
  uf: Uf,
  city: t.String,
});

const options = {
  i18n: {
    ...Form.i18n,
    optional: ' (opcional)',
  },
  fields: {
    name: {
      label: 'Nome completo',
      error: MANDATORY_FIELD_MESSAGE,
      maxLength: 40,
      autoCapitalize: 'words',
    },
    email: {
      label: 'E-mail',
      error: MANDATORY_FIELD_MESSAGE,
      maxLength: 40,
      keyboardType: 'email-address',
    },
    phoneNumber: {
      label: 'Número do celular',
      error: MANDATORY_FIELD_MESSAGE,
      maxLength: 11,
      keyboardType: 'number-pad',
    },
    birthDate: {
      label: 'Data de nascimento',
      error: MANDATORY_FIELD_MESSAGE,
      mode: 'date',
      defaultValueText: 'Selecione uma data',
    },
    cep: {
      label: 'CEP',
      maxLength: 8,
      keyboardType: 'number-pad',
    },
    uf: {
      label: 'Estado',
      error: MANDATORY_FIELD_MESSAGE,
    },
    district: {
      label: 'Bairro',
      error: MANDATORY_FIELD_MESSAGE,
      maxLength: 30,
      autoCapitalize: 'words',
    },
    city: {
      label: 'Cidade',
      error: MANDATORY_FIELD_MESSAGE,
      maxLength: 30,
      autoCapitalize: 'words',
    },
  },
};

export default class SignUp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: {},
    }
  }

  static navigationOptions = {
    headerTitle: 'Novo cadastro',
    headerStyle: {
      backgroundColor: Theme.COLORS[2],
    },
    headerTintColor: Theme.COLORS[5],
  };

  handleSubmit = () => {
    const value = this._form.getValue();
    sendUser(this.state.user);
  }

  onChange = (user) => {
    const cep = new Cep(user.cep);
    if (cep.canReload(this.state.user.cep)) {
      getCep(user.cep).then((cepDetails) => this.setState({ user: { ...user, ...cepDetails } }));
    }
    this.setState({ user: { ...user } });
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.form}>
          <Form ref={c => this._form = c} type={User} value={this.state.user} options={options} onChange={this.onChange} />
          <Button
            text="Cadastrar-se"
            onPress={this.handleSubmit}
          />
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  form: {
    marginBottom: 30,
  }
});

async function getCep(cep) {
  try {
    let response = await fetch(`${CEP_PATH}/${cep}/json`);
    let responseJson = await response.json();
    return {
      uf: responseJson.uf,
      cep: responseJson.cep.replace(/-/g, ''),
      district: responseJson.bairro,
      city: responseJson.localidade,
    };
  } catch (error) {
    alert('Ocorreu um erro');
  }
}

async function sendUser(user) {
  try {
    let response = await fetch(`${API_PATH}/users`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: user,
      }),
    });
    let responseJson = await response.json();
    return responseJson;
  } catch(error) {
    console.log(error);
    alert('Ocorreu um erro');
  }
}

class Cep {
  constructor(cep) {
    this.cep = cep;
  }

  isValid() {
    return this.cep !== null && this.cep !== undefined && this.cep.length === 8;
  }

  equals(cep) {
    return this.cep === cep;
  }

  canReload(cep) {
    return this.isValid() && !this.equals(cep);
  }
}