<script setup lang="ts">
defineProps<{
  hydrated: boolean;
}>();

const animatedText = computed(() => {
  const welcomeText = 'Welcome to ';
  const vocabText = 'VocabDrop!';

  return [
    ...welcomeText.split('').map((letter, index) => ({
      letter,
      delay: index * 50,
      isGradient: false,
    })),
    {
      word: vocabText,
      delay: welcomeText.length * 50,
      isGradient: true,
    },
  ];
});

function getLetterColor(index: number, length: number) {
  // Start with green (hue: 120) and transition to blue (hue: 240)
  const hue = 120 + (index / (length - 1)) * 120;
  return `hsl(${hue}, 100%, 45%)`;
}
</script>

<template>
  <div class="text-center">
    <img src="/icon.png" alt="Vocab Icon" class="w-20 h-20 mx-auto mb-4" />

    <h1 class="text-3xl font-bold mb-2">
      <span v-for="(item, index) in animatedText" :key="index">
        <template v-if="'letter' in item">
          <span
            class="transition-all duration-500"
            :class="{
              'opacity-100 translate-y-0': hydrated,
              'opacity-0 -translate-x-3': !hydrated
}"
            :style="{ transitionDelay: `${item.delay}ms` }"
          >
            {{ item.letter }}
          </span>
        </template>
        <template v-else>
          <span>
            <span 
              v-for="(letter, letterIndex) in item.word" 
              :key="letterIndex"
              class="transition-all duration-500 inline-block"
              :class="{
                'opacity-100 translate-y-0': hydrated,
                'opacity-0 -translate-y-3': !hydrated
}"
              :style="{ 
                transitionDelay: `${item.delay + letterIndex * 80}ms`,
                color: getLetterColor(letterIndex, item.word.length)
              }"
            >
              {{ letter }}
            </span>
          </span>
        </template>
      </span>
    </h1>

    <p class="text-gray-300 mb-6 transition-colors duration-200">
      Upload your vocabulary list and practice with interactive flashcards.
    </p>
  </div>
</template>
