<template>
  <v-alert :value="true" type="error" dismissible border="bottom" colored-border elevation="2">
    <h3>{{message}}</h3>
  </v-alert>
</template>

<script>
export default {
  props: ["message"],
};
</script>