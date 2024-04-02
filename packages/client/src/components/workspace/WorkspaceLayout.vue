<template>
  <EditorProvider>
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
  </EditorProvider>
</template>

<script setup>
import {
  NMessageProvider,
  NLayout,
  NLayoutSider,
  NLayoutHeader,
} from 'naive-ui';
import EditorProvider from './EditorProvider.vue';
import Sidebar from './Sidebar.vue';
import TopBar from './TopBar.vue';
import EditorContainer from './EditorContainer.vue';
</script>
