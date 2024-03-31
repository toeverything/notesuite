<template>
  <n-message-provider>
    <EditorProvider>
      <div class="app">
        <Sidebar />
        <div class="main-content">
          <TopBar />
          <EditorContainer />
        </div>
      </div>
    </EditorProvider>
  </n-message-provider>
</template>

<script setup>
import { NMessageProvider } from 'naive-ui'
import EditorProvider from './components/EditorProvider.vue';
import Sidebar from './components/Sidebar.vue';
import TopBar from './components/TopBar.vue';
import EditorContainer from './components/EditorContainer.vue';
import './index.css';
</script>
