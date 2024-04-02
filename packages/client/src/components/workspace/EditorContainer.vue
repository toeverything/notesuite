<template>
  <div class="editor-container" ref="editorContainerRef"></div>
</template>

<script setup lang="ts">
import { inject, onMounted, ref } from 'vue';
import type { WorkspaceContext } from './WorkspaceLayout.vue';

const { editor } = inject<WorkspaceContext>('workspaceContext')!;
const editorContainerRef = ref<HTMLDivElement>();

onMounted(() => {
  editorContainerRef.value && editorContainerRef.value.appendChild(editor);
});
</script>
