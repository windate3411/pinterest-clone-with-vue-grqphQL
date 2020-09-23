<template>
  <v-card>
    <v-alert type="error" v-if="error" text dismissible>{{error}}}</v-alert>
    <div class="flex-container" color="white">
      <div class="img-wrapper my-5">
        <v-img contain :src="require('../../assets/images/logo.jpg')" height="100%" width="100px"></v-img>
      </div>
      <h1>Log In</h1>
      <h3 class="message text-center">Already has a Vinterest account? Log in to explore more!</h3>
      <v-form v-model="isFormValid" lazy-validation ref="form" class="mt-2">
        <v-text-field
          name="username"
          placeholder="Uesrname"
          :rules="usernameRules"
          prepend-inner-icon="mdi-account"
          type="text"
          height="48"
          rounded
          v-model="username"
          counter="12"
          outlined
        ></v-text-field>

        <v-text-field
          id="password"
          label="Password"
          name="password"
          prepend-inner-icon="mdi-lock"
          type="password"
          :rules="passwordRules"
          rounded
          height="48"
          outlined
          v-model="password"
        ></v-text-field>
      </v-form>
      <v-btn
        color="primary"
        @click="handleSigninSubmit"
        :loading="loading"
        :disabled="loading || !isFormValid"
        rounded
        width="60%"
      >
        <template v-slot:loader>
          <span class="custom-loader">
            <v-icon light>mdi-cached</v-icon>
          </span>
        </template>
        <span class="font-weight-bold text-capitalize">Log in</span>
      </v-btn>
      <h3 class="mt-2">
        Doesn't have an account?
        <a class="ml-2" @click.prevent="handleSignupModalToggle">Sign up</a>
      </h3>
      <div class="footer-hint-wrapper mt-3 text-center">
        <span class="footer-hint">
          By continuing, you agree to Vinterest's
          <b>Terms of Service, Privacy policy</b>
        </span>
      </div>
    </div>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Signin",
  data() {
    return {
      username: "",
      password: "",
      usernameRules: [
        (value) => !!value || "Username is required",
        (value) =>
          value.length < 12 || "Username must be less than 12 characters",
      ],
      passwordRules: [(value) => !!value || "Password is required"],
      isFormValid: true,
    };
  },
  methods: {
    ...mapActions(["signinUser"]),
    handleSigninSubmit() {
      if (this.$refs.form.validate()) {
        this.signinUser({
          username: this.username,
          password: this.password,
        });
      }
    },
    handleSignupModalToggle() {
      this.$emit('toggleSignupModal')
    }
  },
  computed: {
    ...mapGetters(["currentUser", "error", "loading"]),
  },
  watch: {
    currentUser: {
      handler: function (value, oldValue) {
        if (value) this.$router.push("/");
      },
      immediate: true,
    },
  },
};
</script>

<style lang="stylus" scoped>

.flex-container
  display flex
  flex-direction column
  align-items center
  width 100%
  overflow hidden
  height 70vh

.message
  font-size 16px
  color rgb(51, 51, 51)
  font-weight normal
  margin 0 auto 18px
  width 270px

.router-link-active
.router-link-exact-active
a 
  text-decoration none


.custom-loader
  animation loader 1s infinite
  display flex

.footer-hint 
  font-size 11px
  font-weight normal
  color rgb(118, 118, 118)

::v-deep .v-text-field 
  width: 100%;
  border-radius: 16px;


@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>