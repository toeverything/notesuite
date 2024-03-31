<template>
  <div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { provide } from 'vue';
import {
  initEditor,
  DocCollection,
  AffineEditorContainer,
} from '@notesuite/common';

export interface AppState {
  editor: AffineEditorContainer;
  collection: DocCollection;
}

provide('appState', initEditor());
</script>
