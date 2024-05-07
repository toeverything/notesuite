<template>
  <NMessageProvider>
    <NLayout position="absolute">
      <NLayoutHeader style="height: 40px" bordered>
        <TopBar />
      </NLayoutHeader>
      <NLayout hasSider position="absolute" style="top: 40px">
        <NLayoutSider
          collapseMode="width"
          :collapsedWidth="0"
          :width="240"
          showTrigger="bar"
          bordered
        >
          <Sidebar />
        </NLayoutSider>
        <NLayout contentStyle="padding: 24px;">
          <EditorContainer />
        </NLayout>
      </NLayout>
    </NLayout>
  </NMessageProvider>
</template>

<script setup lang="ts">
import { provide, onMounted } from 'vue';
import {
  NMessageProvider,
  NLayout,
  NLayoutSider,
  NLayoutHeader,
} from 'naive-ui';
import Sidebar from './Sidebar.vue';
import TopBar from './TopBar.vue';
import EditorContainer from './EditorContainer.vue';
import { DocCollection } from '@blocksuite/store';
import {
  AffineEditorContainer,
  initWorkspaceContext,
} from '../../utils/editor';
import { api } from '../../utils/api';
import type { CollabFS } from '@notesuite/common';

export interface WorkspaceContext {
  editor: AffineEditorContainer;
  collection: DocCollection;
  client: CollabFS;
}

const workspaceId = location.pathname.split('/')[1];
const context = initWorkspaceContext(workspaceId);
provide<WorkspaceContext>('workspaceContext', context);
// @ts-ignore
window.context = context;

onMounted(async () => await api.setActiveWorkspace(workspaceId));
</script>
