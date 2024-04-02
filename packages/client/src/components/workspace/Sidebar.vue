<template>
  <NMenu :options="menuOptions" @update:value="selectDoc" />
</template>

<script setup lang="ts">
import { inject, ref, onMounted } from 'vue';
import { NMenu } from 'naive-ui';
import type { MenuOption } from 'naive-ui';
import { Doc } from '@notesuite/common';
import type { WorkspaceContext } from './WorkspaceLayout.vue';

const { editor, collection } = inject<WorkspaceContext>('workspaceContext')!;
const menuOptions = ref<MenuOption[]>([]);

function updateDocs() {
  menuOptions.value = [...collection.docs.values()].map(doc => ({
    label: doc.meta?.title || 'Untitled',
    key: doc.id,
  }));
}

function selectDoc(key: string) {
  const doc = [...collection.docs.values()].find(d => d.id === key) as Doc;
  if (!doc) return;
  editor.doc = doc;
  updateDocs();
}

onMounted(updateDocs);
collection.slots.docUpdated.on(updateDocs);
editor.slots.docLinkClicked.on(updateDocs);
</script>
