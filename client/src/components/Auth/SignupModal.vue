<template>
  <v-card>
    <v-alert type="error" v-if="error" text dismissible>{{error}}}</v-alert>
    <div class="flex-container" color="white">
      <div class="img-wrapper my-5">
        <v-img contain :src="require('../../assets/images/logo.jpg')" height="100%" width="100px"></v-img>
      </div>
      <h1>Sign Up</h1>
      <h3 class="message text-center">Join Vinterest to share your thoughts!</h3>
      <v-form v-model="isFormValid" lazy-validation ref="form" class="mt-2">
        <v-text-field
          label="Username"
          name="username"
          :rules="usernameRules"
          prepend-icon="mdi-account"
          type="text"
          v-model="username"
          rounded
          outlined
        ></v-text-field>

        <v-text-field
          id="email"
          label="email"
          name="email"
          prepend-icon="mdi-email"
          type="email"
          :rules="emailRules"
          v-model="email"
          rounded
          outlined
        ></v-text-field>

        <v-text-field
          id="password"
          label="Password"
          name="password"
          prepend-icon="mdi-lock"
          type="password"
          :rules="passwordRules"
          v-model="password"
          rounded
          outlined
        ></v-text-field>

        <v-text-field
          id="passwordConfirmation"
          label="Confirm Password"
          name="passwordConfirmation"
          prepend-icon="mdi-lock"
          type="password"
          :rules="passwordConfirmationRules"
          v-model="passwordConfirmation"
          rounded
          outlined
        ></v-text-field>
      </v-form>
      <v-btn
        color="primary"
        @click="handleSignupSubmit"
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
        <span class="font-weight-bold text-capitalize">Sign up</span>
      </v-btn>
      <h3 class="mt-2">
        Already have an account?
        <a class="ml-2" @click.prevent="handleSigninModalToggle">Log In</a>
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
  name: "SignUp",
  data() {
    return {
      username: "",
      password: "",
      email: "",
      passwordConfirmation: "",
      usernameRules: [
        (value) => !!value || "Username is required",
        (value) =>
          value.length < 12 || "Username must be less than 12 characters",
      ],
      passwordRules: [(value) => !!value || "Password is required"],
      passwordConfirmationRules: [
        (value) => !!value || "Password confirmation is required",
        (value) => value === this.password || "Password mismatched",
      ],
      emailRules: [
        (value) => !!value || "Email is required",
        (value) => /.+@.+\..+/.test(value) || "Email must be valid",
      ],
      isFormValid: true,
    };
  },
  methods: {
    ...mapActions(["signupUser"]),
    handleSignupSubmit() {
      if (this.$refs.form.validate()) {
        this.signupUser({
          username: this.username,
          email: this.email,
          password: this.password,
        });
      }
    },
    handleSigninModalToggle() {
      this.$emit('toggleSigninModal')
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
  height 80px
  overflow hidden
  height 90vh


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