<template>
  <v-container class="mt-5 text-center">
    <v-row>
      <v-col xs="12" md="6" offset="sm-3">
        <h1>Welcome Back My friend</h1>
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
            <v-toolbar-title class="text-center">Sign in to Vinterest</v-toolbar-title>
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
                id="password"
                label="Password"
                name="password"
                prepend-icon="mdi-lock"
                type="password"
                :rules="passwordRules"
                v-model="password"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-row>
              <v-col xs="12">
                <v-btn
                  color="accent"
                  @click="handleSigninSubmit"
                  :loading="loading"
                  :disabled="loading || !isFormValid"
                >
                  <template v-slot:loader>
                    <span class="custom-loader">
                      <v-icon light>mdi-cached</v-icon>
                    </span>
                  </template>
                  Sign in
                </v-btn>
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

<style scoped>
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
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