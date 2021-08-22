<template>
  <div class="my-6">
    <h1 class="has-text-centered is-size-1 is-size-4-mobile pt-6">
      Generate {{objectText}} Image <br/> on the go for your posts
    </h1>

    <div class="has-text-centered">
      <router-link to="/profile">
        <button class="button mt-6 is-info is-rounded is-large is-size-6-mobile">Imagin Now</button>
      </router-link>
    </div>  
  </div>
</template>

<script>

export default {
  name: "home",
  data() {
    return {
       objectText: 'Social',
    }
  },
  mounted() {
    //change text dynamically
    let counter = 0
    let objectTextArr = ["Social", "Open Graph's", "Twitter Card's"]
    const _this = this
    setInterval(function() {
      _this.objectText = objectTextArr[counter]
      counter++;
      if (counter >= objectTextArr.length) {
        counter = 0;
      }
    }, 1000)
  },
  methods: {
    login() {
      this.$auth.loginWithRedirect();
    },
    logout() {
      this.$auth.logout({
        returnTo: window.location.origin
      });
    },
  }
};
</script>