<template>
  <div class="centered-container">
    <div class="centered-content">
      <NLayout>
        <NLayoutHeader>
          <h1>Welcome to NoteSuite!</h1>
        </NLayoutHeader>
        <NLayoutContent>
          <NTabs type="card" paneStyle="width: 500px;">
            <NTabPane name="create" tab="Create Workspace">
              <NCard contentStyle="padding-bottom: 28px;">
                <p>Create a new workspace from scratch.</p>
                <NButton type="primary">Create</NButton>
              </NCard>
            </NTabPane>
            <NTabPane name="import" tab="Import Workspace">
              <NCard>
                <NUpload>
                  <p>
                    Import a local or remote workspace.
                  </p>
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

<script setup>
import {
  NLayout,
  NLayoutHeader,
  NLayoutContent,
  NCard,
  NUpload,
  NButton,
  NTabs,
  NTabPane,
} from 'naive-ui';
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
