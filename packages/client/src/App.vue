<template>
  <WorkspaceLayout v-if="showLayout" />
  <WorkspaceLauncher v-else />
</template>

<script setup>
import { ref } from 'vue';
import WorkspaceLayout from './components/WorkspaceLayout.vue';
import WorkspaceLauncher from './components/WorkspaceLauncher.vue';

const params = new URLSearchParams(window.location.search);
const showLayout = ref(params.has('init'));
</script>
