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
import { provide } from 'vue';
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
import { CollabFS } from '@notesuite/common';
import {
  AffineEditorContainer,
  // initEmptyDoc,
  initWorkspaceContext,
} from '../../utils/editor';

export interface WorkspaceContext {
  editor: AffineEditorContainer;
  collection: DocCollection;
}

const workspaceId = location.pathname.split('/')[1];
const context = initWorkspaceContext(workspaceId);
provide('workspaceContext', context);
// @ts-ignore
window.context = context;

const client = new CollabFS({
  endpoint: 'localhost:3000',
  indexId: workspaceId,
  indexDoc: context.collection.doc,
});
client.slots.indexSynced.on(() => client.debug());

// initEmptyDoc(context.editor, context.collection);
</script>
