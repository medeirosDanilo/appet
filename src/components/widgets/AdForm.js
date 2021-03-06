import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Switch, Text } from 'react-native';
import { connect } from 'react-redux';
import t from 'tcomb-form-native';

import { Button, PickImage } from './';
import {
  UFS,
  MANDATORY_FIELD_MESSAGE,
  PET_TYPES,
  SIZE_TYPES,
} from '../../constants';

const Form = t.form.Form;

const PetType = t.enums(PET_TYPES, 'PetType');

const SizeType = t.enums(SIZE_TYPES, 'SizeType');

const Uf = t.enums(UFS, 'Uf');

const Ad = {
  data: t.struct({
    title: t.String,
    pet_name: t.maybe(t.String),
    pet_type: PetType,
    description: t.String,
    aprox_age: t.maybe(t.Number),
    weight: t.maybe(t.Number),
    size: SizeType,
  }),
  address: t.struct({
    postal_code: t.maybe(t.String),
    neighborhood: t.String,
    city: t.String,
    state: Uf,
  }),
};

class AdForm extends Component {
  constructor(props) {
    super(props);

    this.editionMode = !!this.props.ad;

    if (this.props.ad) {
      const { postal_code, neighborhood, city, state, ...ad } = this.props.ad;
      this.state = {
        ad: {
          data: { ...ad },
          address: { postal_code, neighborhood, city, state },
        },
        sameAddressOfUser: false,
        image: null,
      };
    } else {
      this.state = {
        ad: {
          data: null,
          address: null,
        },
        sameAddressOfUser: false,
        image: null,
      };
    }
  }

  dataFormOptions() {
    return {
      i18n: {
        ...Form.i18n,
        optional: ' (opcional)',
      },
      fields: {
        title: {
          label: 'Título do anúncio',
          maxLength: 30,
          autoCapitalize: 'sentences',
          returnKeyType: 'next',
          onSubmitEditing: () =>
            this._form.getComponent('pet_name').refs.input.focus(),
        },
        pet_name: {
          label: 'Nome do pet',
          maxLength: 40,
          autoCapitalize: 'words',
        },
        pet_type: {
          label: 'Tipo de pet',
          error: MANDATORY_FIELD_MESSAGE,
        },
        description: {
          label: 'Descrição',
          maxLength: 100,
          numberOfLines: 5,
          multiline: true,
          returnKeyType: 'next',
          onSubmitEditing: () =>
            this._form.getComponent('aprox_age').refs.input.focus(),
        },
        aprox_age: {
          label: 'Idade aprox. em meses',
        },
        weight: {
          label: 'Peso aprox.',
        },
        size: {
          label: 'Tamanho',
        },
      },
    };
  }

  addressFormOptions() {
    return {
      i18n: {
        ...Form.i18n,
        optional: ' (opcional)',
      },
      fields: {
        postal_code: {
          label: 'CEP',
          maxLength: 8,
          keyboardType: 'number-pad',
          returnKeyType: 'next',
          onSubmitEditing: () =>
            this._form1.getComponent('neighborhood').refs.input.focus(),
        },
        neighborhood: {
          label: 'Bairro',
          error: MANDATORY_FIELD_MESSAGE,
          maxLength: 30,
          autoCapitalize: 'words',
          returnKeyType: 'next',
          onSubmitEditing: () =>
            this._form1.getComponent('city').refs.input.focus(),
        },
        city: {
          label: 'Cidade',
          error: MANDATORY_FIELD_MESSAGE,
          maxLength: 30,
          autoCapitalize: 'words',
        },
        state: {
          label: 'Estado',
          error: MANDATORY_FIELD_MESSAGE,
        },
      },
    };
  }

  onImagePicked(image) {
    this.setState({
      ...this.state,
      image,
    });
  }

  handleSubmit() {
    const adData = this._form.getValue();
    const address = this._form1.getValue();

    if (!this.state.image && !this.editionMode) {
      alert('Por favor, anexe uma imagem!');
      return;
    }

    if (adData && address) {
      const ad = {
        id: this.state.ad.data.id,
        ...adData,
        ...address,
      };
      this.props.onSave(ad, this.state.image);
    }
  }

  onAddressModeValueChange(value) {
    if (value) {
      this.setState({
        ...this.state,
        sameAddressOfUser: true,
        ad: {
          ...this.state.ad,
          address: {
            postal_code: this.props.currentUser.postal_code,
            neighborhood: this.props.currentUser.neighborhood,
            city: this.props.currentUser.city,
            state: this.props.currentUser.state,
          },
        },
      });
    } else {
      this.setState({
        ...this.state,
        sameAddressOfUser: false,
      });
    }
  }

  onDataFormChanged(value) {
    this.setState({
      ...this.state,
      ad: {
        ...this.state.ad,
        data: value,
      },
    });
  }

  onAddressFormChanged(value) {
    this.setState({
      ...this.state,
      ad: {
        ...this.state.ad,
        address: value,
      },
    });
  }

  renderButton() {
    if (this.props.isLoading) {
      return <Button text={'Carregando...'} onPress={() => {}} />;
    } else {
      return <Button text={'Confirmar'} onPress={() => this.handleSubmit()} />;
    }
  }

  render() {
    const imageUrl = this.props.ad ? this.props.ad.picture_url : null;

    return (
      <View style={{ flex: 1 }}>
        <ScrollView>
          <PickImage
            imageUrl={imageUrl}
            onImagePicked={image => this.onImagePicked(image)}
          />
          <View style={styles.form}>
            <Form
              ref={c => (this._form = c)}
              type={Ad.data}
              value={this.state.ad.data}
              options={this.dataFormOptions()}
              onChange={value => this.onDataFormChanged(value)}
            />

            <View style={styles.switchContainer}>
              <Text style={styles.address}>Usar seu endereço?</Text>
              <Switch
                onValueChange={value => this.onAddressModeValueChange(value)}
                value={this.state.sameAddressOfUser}
              />
            </View>

            <Form
              ref={c => (this._form1 = c)}
              type={Ad.address}
              value={this.state.ad.address}
              options={this.addressFormOptions()}
              onChange={value => this.onAddressFormChanged(value)}
            />
          </View>
        </ScrollView>
        {this.renderButton()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  form: {
    padding: 20,
    marginBottom: 30,
  },
  description: {
    height: 200,
  },
  switchContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  address: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#000',
  },
});

const mapStateToProps = state => ({
  isLoading: state.ui.isLoading,
  currentUser: state.users.currentUser,
});

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AdForm);
