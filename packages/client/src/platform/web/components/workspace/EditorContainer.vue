<template>
  <div class="editor-container" ref="editorContainerRef"></div>
</template>

<script setup lang="ts">
import { inject, onMounted, ref } from 'vue';
import { DocCollection, Schema } from '../../utils/editor';
import { AffineSchemas } from '../../utils/editor';
import type { WorkspaceContext } from './WorkspaceLayout.vue';

const { editor } = inject<WorkspaceContext>('workspaceContext')!;
const editorContainerRef = ref<HTMLDivElement>();

const schema = new Schema().register(AffineSchemas);
// placeholder doc with no blocks inside
const placeholderDoc = new DocCollection({ schema }).createDoc();

onMounted(() => {
  if (!editorContainerRef.value) return;
  editor.doc = placeholderDoc;
  editorContainerRef.value.appendChild(editor);
});
</script>
