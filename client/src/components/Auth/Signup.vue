<template>
  <v-container class="mt-5 text-center">
    <v-row>
      <v-col xs="12" md="6" offset="sm-3">
        <h1>Get started!</h1>
      </v-col>
    </v-row>

    <!-- form alert -->
    <v-row v-if="error">
      <v-col xs="12" sm="6" offset="sm-3">
        <form-alert :message="error"></form-alert>
      </v-col>
    </v-row>
    <!-- signin form -->
    <v-row>
      <v-col xs="12" sm="6" offset="sm-3">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title class="text-center">Sign up to Vinterest</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form v-model="isFormValid" lazy-validation ref="form">
              <v-text-field
                label="Username"
                name="username"
                :rules="usernameRules"
                prepend-icon="mdi-account"
                type="text"
                v-model="username"
              ></v-text-field>

              <v-text-field
                id="email"
                label="email"
                name="email"
                prepend-icon="mdi-email"
                type="email"
                :rules="emailRules"
                v-model="email"
              ></v-text-field>

              <v-text-field
                id="password"
                label="Password"
                name="password"
                prepend-icon="mdi-lock"
                type="password"
                :rules="passwordRules"
                v-model="password"
              ></v-text-field>

              <v-text-field
                id="passwordConfirmation"
                label="Confirm Your Password"
                name="passwordConfirmation"
                prepend-icon="mdi-lock"
                type="password"
                :rules="passwordConfirmationRules"
                v-model="passwordConfirmation"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-row>
              <v-col xs="12">
                <v-btn
                  color="accent"
                  @click="handleSignupSubmit"
                  :loading="loading"
                  :disabled="loading || !isFormValid"
                >
                  <template v-slot:loader>
                    <span class="custom-loader">
                      <v-icon light>mdi-cached</v-icon>
                    </span>
                  </template>
                  Sign Up
                </v-btn>
                <h4 class="grey--text mt-3">
                  Already have an account?
                  <router-link class="ml-2" to="/signin">Sign in</router-link>
                </h4>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
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
