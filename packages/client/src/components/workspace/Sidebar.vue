<template>
  <div style="display: flex; flex-direction: column; height: 100%">
    <div style="flex: 1">
      <NMenu :options="menuOptions" @update:value="selectDoc" />
    </div>
    <div style="padding: 10px">
      <NDropdown
        trigger="hover"
        style="width: 220px"
        :options="createButtonOptions"
        @select="createDoc"
      >
        <NButton block>Create</NButton>
      </NDropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, onMounted } from 'vue';
import { NMenu, NButton, NDropdown } from 'naive-ui';
import type { MenuOption } from 'naive-ui';
import { Doc } from '@blocksuite/store';
import type { WorkspaceContext } from './WorkspaceLayout.vue';
import { createInitialDoc } from '../../utils/editor';

const { editor, collection } = inject<WorkspaceContext>('workspaceContext')!;
const menuOptions = ref<MenuOption[]>([]);
const createButtonOptions = [
  {
    label: 'Block Document',
    key: 'block document',
  },
  {
    label: 'Markdown',
    key: 'markdown',
    disabled: true,
  },
];

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

function createDoc(key: string) {
  createInitialDoc(editor, collection);
}

onMounted(updateDocs);
collection.slots.docUpdated.on(updateDocs);
editor.slots.docLinkClicked.on(updateDocs);
</script>
