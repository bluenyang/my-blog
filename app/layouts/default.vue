<script setup lang="ts"></script>

<template>
  <div class="flex h-600 flex-row">
    <Siderbar />

    <div class="relative flex grow flex-col">
      <Header />
      <main class="flex-1">
        <slot />
      </main>
    </div>
  </div>
</template>
