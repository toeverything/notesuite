<template>
  <EditorProvider>
    <n-message-provider>
      <n-layout position="absolute">
        <n-layout-header style="height: 40px" bordered>
          <TopBar />
        </n-layout-header>
        <n-layout has-sider position="absolute" style="top: 40px;">
          <n-layout-sider
            collapse-mode="width"
            :collapsed-width="120"
            :width="240"
            show-trigger="bar"
            bordered
          >
            <Sidebar />
          </n-layout-sider>
          <n-layout content-style="padding: 24px;">
            <EditorContainer />
          </n-layout>
        </n-layout>
      </n-layout>
    </n-message-provider>
  </EditorProvider>
</template>

<script setup>
import {
  NMessageProvider,
  NLayout,
  NLayoutSider,
  NLayoutHeader,
} from 'naive-ui';
import EditorProvider from './components/EditorProvider.vue';
import Sidebar from './components/Sidebar.vue';
import TopBar from './components/TopBar.vue';
import EditorContainer from './components/EditorContainer.vue';
import './index.css';
</script>
