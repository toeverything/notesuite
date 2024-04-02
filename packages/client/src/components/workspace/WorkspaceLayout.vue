<template>
  <NMessageProvider>
    <NLayout position="absolute">
      <NLayoutHeader style="height: 40px" bordered>
        <TopBar />
      </NLayoutHeader>
      <NLayout hasSider position="absolute" style="top: 40px">
        <NLayoutSider
          collapseMode="width"
          :collapsedWidth="30"
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
import {
  AffineEditorContainer,
  DocCollection,
  initEmptyDoc,
  initWorkspaceContext,
} from '@notesuite/common';

export interface WorkspaceContext {
  editor: AffineEditorContainer;
  collection: DocCollection;
}

const context = initWorkspaceContext();
provide('workspaceContext', context);

initEmptyDoc(context.editor, context.collection);
</script>
