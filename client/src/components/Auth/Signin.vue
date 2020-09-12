<template>
  <v-container class="mt-5 text-center">
    <v-row>
      <v-col xs="12" md="6" offset="sm-3">
        <h1>Welcome Back My friend</h1>
      </v-col>
    </v-row>

    <!-- signin form -->
    <v-row>
      <v-col xs="12" md="6" offset="sm-3">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title class="text-center">Sign in to Vinterest</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field
                label="Username"
                name="username"
                prepend-icon="mdi-account"
                type="text"
                v-model="username"
              ></v-text-field>

              <v-text-field
                id="password"
                label="Password"
                name="password"
                prepend-icon="mdi-lock"
                type="password"
                v-model="password"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-row>
              <v-col xs="12">
                <v-btn color="accent" @click="handleSigninSubmit">Sign in</v-btn>
                <h4 class="grey--text mt-3">
                  Doesn't have an account?
                  <router-link class="ml-2" to="/signup">Sign up</router-link>
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
  name: "Signin",
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    ...mapActions(["signinUser"]),
    handleSigninSubmit() {
      this.signinUser({
        username: this.username,
        password: this.password,
      });
    },
  },
};
</script>
