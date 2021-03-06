import React from 'react'
import { connect } from 'react-redux'
import { NavigationActions } from 'react-navigation'
import {
  Screen,
  ScrollView,
  GridRow,
  TouchableOpacity,
  Image,
  Subtitle,
  Card,
  View,
  Caption,
  Row,
  Button,
  Icon,
  Title,
  Text,
  Divider
} from '@shoutem/ui';

import VendorActions from '../Redux/VendorRedux'
import CartActions from '../Redux/CartRedux'
import Chevron from '../Components/Chevron'

class CartItemList extends React.Component {

  render () {
    const populated_cart = this.props.populated_cart
    const cart = this.props.cart
    const total = populated_cart && populated_cart.reduce(
      function(sum, curr) {
        return sum + parseFloat(curr.total)
      }, 0.0
    )

    if (!cart || !populated_cart || this.props.emptyCart) {
      return (
        <View styleName="center md-gutter-top md-gutter-bottom">
          <Text>Your cart is empty!</Text>
        </View>
      )
    }

    return (
      <View>
        {
          populated_cart.map((vendor, i) => (
            <View key={vendor.id}>
              <TouchableOpacity onPress={this.props.navigateVendor.bind(this, vendor)}>
                <Row styleName="small">
                  <Title>{vendor.name}</Title>
                  <Chevron />
                </Row>
              </TouchableOpacity>
              {
                vendor.items.map((item, j) => (
                  <Row key={vendor.id + '-' + item.id}>
                    <Image
                      styleName="small rounded-corners"
                      source={{ uri: item.image_file_src }}
                    />
                    <View styleName="vertical stretch space-between">
                      <Subtitle>{item.name}</Subtitle>
                      <View styleName="horizontal">
                        <Subtitle styleName="md-gutter-right">${item.total}</Subtitle>
                      </View>
                      {
                        cart[vendor.id][item.id] > item.quantity ?
                          <Caption>Not enough stock! Please re-add this item before reserving</Caption>
                        :
                          <Caption>Quantity: {cart[vendor.id][item.id]} x ${item.price}/{item.unit}</Caption>
                      }
                    </View>
                    <Button styleName="right-icon" onPress={this.props.removeFromCart.bind(this, vendor.id, item.id)}><Icon name="close"/></Button>
                  </Row>
                ))
              }
            </View>
          ))
        }
        <Divider styleName="line" />
        <Row>
          <View styleName="horizontal space-between">
            <Title>Total</Title>
            <Title styleName="right">{'$' + total.toFixed(2)}</Title>
          </View>
        </Row>
        <Divider styleName="line" />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    populated_cart: state.cart.populated_cart,
    cart: state.cart.cart,
    emptyCart: state.cart.emptyCart
  }
}

const mapDispatchToProps = (dispatch) => ({
  removeFromCart: (vendor_id, item_id) => dispatch(CartActions.remove(vendor_id, item_id)),
  navigateVendor: (vendor) => {
    dispatch(VendorActions.vendorRequest(vendor))
    dispatch(NavigationActions.navigate({ routeName: 'VendorTab' }))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(CartItemList)
