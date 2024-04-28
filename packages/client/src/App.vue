<template>
  <WorkspaceLauncher v-if="isLauncher" />
  <WorkspaceLayout v-else />
</template>

<script setup>
import { ref } from 'vue';
import WorkspaceLayout from './components/workspace/WorkspaceLayout.vue';
import WorkspaceLauncher from './components/launcher/WorkspaceLauncher.vue';

const isLauncher = ref(window.location.pathname === '/');
</script>
