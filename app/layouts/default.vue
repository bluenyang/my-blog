<script setup lang="ts"></script>

<template>
  <div class="flex flex-row">
    <Siderbar />

    <div class="relative flex grow flex-col">
      <Header />
      <main class="flex-1">
        <slot />
      </main>
      <Footer />
    </div>
  </div>
</template>
