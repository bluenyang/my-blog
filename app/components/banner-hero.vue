<script setup lang="ts">
  const { displayText } = useSnippet();

  /*
   * 히어로는 LCP 요소라 미리 preload한다.
   * 런타임 이미지 변환(ipx / Netlify Image CDN)에 기대지 않고 빌드 전에 인코딩해 둔 파일을
   * 그대로 쓴다 — 배포 플랫폼이 바뀌어도 동작이 달라지지 않는다.
   */
  useHead({
    link: [
      {
        rel: 'preload',
        as: 'image',
        href: '/images/hero-1408.webp',
        imagesrcset: '/images/hero-768.webp 768w, /images/hero-1408.webp 1408w',
        imagesizes: '100vw',
      },
    ],
  });
</script>

<template>
  <div class="relative z-0 flex h-screen w-full items-center justify-center">
    <div class="relative z-30 flex h-full flex-col items-center justify-center px-4 text-center">
      <strong class="animate-slide-up mb-8 text-5xl font-bold text-gray-800 dark:text-gray-200">
        {{ "BlueNyang's Dev-log" }}
      </strong>
      <p class="animate-slide-up rounded-lg bg-black/50 px-4 pt-1 pb-2 text-xl">
        <code class="font-tektur text-sky-400"> {{ displayText }} </code>
        <span class="animate-blink mb-1 inline-block h-6 w-3 bg-sky-300 align-middle"></span>
      </p>
    </div>
    <div
      class="absolute z-20 h-full w-full bg-gray-500/50 transition-colors duration-500 dark:bg-black/50"
    ></div>
    <img
      src="/images/hero-1408.webp"
      srcset="/images/hero-768.webp 768w, /images/hero-1408.webp 1408w"
      sizes="100vw"
      alt="Blog hero image"
      width="1408"
      height="768"
      loading="eager"
      fetchpriority="high"
      decoding="async"
      class="animate-slow-zoom absolute z-10 h-full w-full object-cover"
    />
  </div>
</template>
