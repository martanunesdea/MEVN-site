<template>
    <div id="page-wrap">
        <ProductsGrid :products="products" />
    </div>
</template>

<script>
//import axios from 'axios';
import ProductsGrid from '../components/ProductsGrid.vue'

export default {
    name: 'ProductsPage',
    components: {
        ProductsGrid,
    },
    data() {
        return {
          products: [],
        };
    },
    async created() {
    // GET REQUEST TO GET ALL PRODUCTS
     /* this works ---- const result = await fetch('./api/products')
          .then(response => response.json())
          .then(data => {
            console.log(data)
            return data
            });
      this.products = result;     */      
      
     /* this works ----- const result = await fetch('./api/products')
        .then(
          function(response) {
            if (response.status !== 200) {
              console.log('Looks like there was a problem. Status Code: ' + response.status);
              return;
            }
            // Examine the text in the response
            response.json().then(function(data) {
              // console.log(data);
              return data;
            });

          }
        )
        .catch(function(err) {
          console.log('Fetch Error :-S', err);
        });
        this.products = result;
        console.log(this.products); */ 


        // POST request to GET ORDERS using fetch with async/await
        /*const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: "john", number: "123456" })
        };
        const response = await fetch("./api/orders/user", requestOptions);
        const data = await response.json();
       // this.postId = data.id;
       console.log(data);
       this.products = data; */

      // POST request to SAVE ONE ORDER 
      const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            id: 53,
            name: "joe", 
            number: "123456",
            lesson: "arts",
            spaces: 3,
            })
        };
        const response = await fetch("./api/orders", requestOptions)
          .then( response => {
            const data = response.json();
            return data;
          }  );
        console.log(response);

         /* const result = await axios.get('/api/products')
          const products = result.data;
          this.products = products; */
    }
}
</script>


<style scoped>
  .grid-wrap {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 16px;
  }

  .product-item {
    align-items: center;
    border-radius: 8px;
    box-shadow: 0px 2px 5px #888;
    display: flex;
    flex-direction: column;
    margin-bottom: 2%;
    padding: 20px;
    position: relative;
    width: 32%;
  }

  .product-name {
    margin-bottom: 0;
  }

  img {
    height: 200px;
    width: 200px;
  }

  a {
    width: 100%;
  }

  button {
    width: 100%;
  }
</style>

