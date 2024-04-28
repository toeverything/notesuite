<template>
  <div class="centered-container">
    <div>
      <NLayout>
        <NLayoutHeader>
          <h1 class="centered-content">Welcome!</h1>
        </NLayoutHeader>
        <NLayoutContent>
          <NTabs type="card" paneStyle="width: 500px;">
            <NTabPane name="create" tab="Open Workspace">
              <NCard contentStyle="padding-bottom: 28px;">
                <NSelect
                  v-if="options.length > 0"
                  placeholder="Select an existing workspace"
                  v-model:value="selected"
                  :options="options"
                  @update:value="onSelected"
                ></NSelect>
                <p>{{ createWorkspaceMessage }}</p>
                <NInputGroup>
                  <NInput placeholder="Workspace name"></NInput>
                  <NButton type="primary">Create</NButton>
                </NInputGroup>
              </NCard>
            </NTabPane>
            <NTabPane name="import" tab="Import Workspace">
              <NCard>
                <NUpload>
                  <p>Import a local workspace.</p>
                  <NButton type="primary">Import</NButton>
                </NUpload>
              </NCard>
            </NTabPane>
          </NTabs>
        </NLayoutContent>
      </NLayout>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  NLayout,
  NInput,
  NInputGroup,
  NSelect,
  NLayoutHeader,
  NLayoutContent,
  NCard,
  NUpload,
  NButton,
  NTabs,
  NTabPane,
} from 'naive-ui';

const selected = ref(null);

const options = [
  { label: 'My Workspace 1', value: 'foo' },
  { label: 'My Workspace 2', value: 'bar' },
];

const createWorkspaceMessage = computed(() => {
  if (options.length === 0) return 'Create a new workspace.';
  return 'Or, create a new workspace.';
});

function onSelected(val: string) {
  console.log(val);
}
</script>

<style>
.centered-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
}

.centered-content {
  text-align: center;
}
</style>
