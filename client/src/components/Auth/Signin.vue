<template>
  <v-container class="mt-5 text-center" fluid>
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
          <v-container>
            <v-row>
              <v-col xs="3">
                <div class="flex-container">
                  <v-img
                    contain
                    :src="require('../../assets/images/logo.jpg')"
                    height="100%"
                    width="100px"
                  ></v-img>
                </div>
              </v-col>
            </v-row>
            <v-row justify="center">
              <h1 class="text-center">Log In</h1>
            </v-row>
            <v-card-text>
              <v-form v-model="isFormValid" lazy-validation ref="form">
                <v-text-field
                  name="username"
                  placeholder="Uesrname"
                  :rules="usernameRules"
                  prepend-inner-icon="mdi-account"
                  type="text"
                  height="48"
                  width="250"
                  rounded
                  v-model="username"
                  outlined
                ></v-text-field>

                <v-text-field
                  id="password"
                  label="Password"
                  name="password"
                  prepend-icon="mdi-lock"
                  type="password"
                  :rules="passwordRules"
                  rounded
                  height="48"
                  v-model="password"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-row>
                <v-col xs="12">
                  <v-btn
                    color="primary"
                    @click="handleSigninSubmit"
                    :loading="loading"
                    :disabled="loading || !isFormValid"
                    rounded
                    width="80%"
                  >
                    <template v-slot:loader>
                      <span class="custom-loader">
                        <v-icon light>mdi-cached</v-icon>
                      </span>
                    </template>
                    <span class="font-weight-bold text-capitalize">Log in</span>
                  </v-btn>
                  <h4 class="grey--text mt-3">
                    Doesn't have an account?
                    <router-link class="ml-2" to="/signup">Sign up</router-link>
                  </h4>
                </v-col>
              </v-row>
            </v-card-actions>
          </v-container>
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

.flex-container{
  display: flex;
  justify-content: center;
  width: 120px;
  height: 80px;
}

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