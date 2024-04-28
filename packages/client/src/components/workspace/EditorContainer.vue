<template>
  <div class="editor-container" ref="editorContainerRef"></div>
</template>

<script setup lang="ts">
import { inject, onMounted, ref } from 'vue';
import type { WorkspaceContext } from './WorkspaceLayout.vue';
import { initEmptyDoc } from '@notesuite/common';

const { editor, collection } = inject<WorkspaceContext>('workspaceContext')!;
const editorContainerRef = ref<HTMLDivElement>();

onMounted(() => {
  // simulate async loading
  setTimeout(() => {
    initEmptyDoc(editor, collection);

    if (!editorContainerRef.value) return;
    if (!editor.doc) return;
    editorContainerRef.value.appendChild(editor);
  });
});
</script>
