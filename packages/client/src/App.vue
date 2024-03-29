<template>
  {{result}}
</template>

<script setup>
import { helloWorld } from '@notesuite/common';

const result = helloWorld();
</script>
