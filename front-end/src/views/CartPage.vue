<template>
    <div id="page-wrap">
        <h1>Shopping Cart</h1>
        <ProductsGrid :products="cartItems" />
        <h3 id="total-price">Total: ${{ totalPrice}}</h3>
        <button id="checkout-button">Proceed to Checkout</button>
    </div>
</template>

<script>
import axios from 'axios';
import ProductsGrid from '../components/ProductsGrid.vue'

export default {
    name: 'CartPage',
    components: {
        ProductsGrid,
    },
    data() {
        return {
            cartItems: [],
        }
    },
    computed: {
        totalPrice() {
            // the function keeps a watch on this.cartItems
            return this.cartItems.reduce(
                (sum, item) => sum + Number(item.price),
                0,
            );
        }
    },
    async created() {
      const result = await axios.get('/api/users/1/cart');
      const cartItems = result.data;
      this.cartItems = cartItems;
    }
}
</script>

<style scoped>
  h1 {
    border-bottom: 1px solid black;
    margin: 0;
    margin-top: 16px;
    padding: 16px;
  }

  #total-price {
    padding: 16px;
    text-align: right;
  }

  #checkout-button {
    width: 100%;
  }

  .product-container {
    align-content: 'center';
    border-bottom: 1px solid #ddd;
    display: flex;
    padding: 16px;
    width: 100%;
  }

  .product-image {
    flex: 1;
    height: 100px;
    max-width: 100px;
  }

  .details-wrap {
    padding: 0 16px;
    flex: 3;
  }

  .remove-button {
    flex: 1;
    margin: auto;
  }
</style>