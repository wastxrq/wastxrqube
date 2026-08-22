<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { scrambledFacelets } from '@/cube'
import { effectiveTime, formatDate, formatTime } from '@/lib'
import { useTimerSessionsStore } from '@/stores'
import type { Solve } from '@/types'
import CubeNet from './CubeNet.vue'

const props = defineProps<{ solve: Solve | null }>()
const emit = defineEmits<{ close: [] }>()

const store = useTimerSessionsStore()

const storeIndex = computed(() =>
  props.solve ? store.solves.findIndex((s) => s === props.solve) : -1,
)
const position = computed(() => storeIndex.value + 1)
const facelets = computed(() => (props.solve ? scrambledFacelets(props.solve.scramble) : ''))

function close() {
  emit('close')
}

function setPenalty(penalty: '+2' | 'DNF') {
  if (storeIndex.value === -1) return
  store.setPenalty(storeIndex.value, penalty)
}

function remove() {
  if (storeIndex.value === -1) return
  store.deleteSolve(storeIndex.value)
  close()
}

function onKeydown(e: KeyboardEvent) {
  if (props.solve && e.key === 'Escape') close()
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <div v-if="solve" class="modal-backdrop" @click.self="close">
      <div class="modal panel">
        <button class="modal-close" title="Закрити" @click="close">✕</button>

        <div class="modal-net">
          <CubeNet :facelets="facelets" />
        </div>

        <div class="modal-scramble">{{ solve.scramble }}</div>

        <div class="modal-time" :class="{ dnf: solve.penalty === 'DNF' }">
          {{ formatTime(effectiveTime(solve)) }}
          <span v-if="solve.penalty !== 'none'" class="modal-penalty">{{ solve.penalty }}</span>
        </div>

        <div class="modal-meta">
          <span>#{{ position }}</span>
          <span>·</span>
          <span>{{ formatDate(solve.date) }}</span>
        </div>

        <div class="modal-actions">
          <button
            class="btn ghost"
            :class="{ active: solve.penalty === '+2' }"
            @click="setPenalty('+2')"
          >
            +2
          </button>
          <button
            class="btn ghost"
            :class="{ active: solve.penalty === 'DNF' }"
            @click="setPenalty('DNF')"
          >
            DNF
          </button>
          <button class="btn ghost danger" @click="remove">Видалити</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 20px;
}
.modal {
  position: relative;
  width: 100%;
  max-width: 360px;
  padding: 32px 28px 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}
.modal-close {
  position: absolute;
  top: 14px;
  right: 14px;
  background: none;
  border: none;
  color: var(--muted);
  font-size: 0.8rem;
  padding: 4px;
}
.modal-close:hover {
  color: var(--text);
}
.modal-net {
  width: 100%;
  max-width: 200px;
  aspect-ratio: 144 / 106;
}
.modal-scramble {
  font-family: var(--font-mono);
  font-size: 1rem;
  letter-spacing: 0.02em;
  text-align: center;
}
.modal-time {
  font-family: var(--font-mono);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  font-size: 2.2rem;
  display: flex;
  align-items: baseline;
  gap: 8px;
}
.modal-time.dnf {
  color: var(--danger);
}
.modal-penalty {
  color: var(--amber);
  font-size: 0.8rem;
  font-weight: 500;
}
.modal-meta {
  display: flex;
  gap: 8px;
  color: var(--muted);
  font-size: 0.82rem;
  font-family: var(--font-mono);
}
.modal-actions {
  display: flex;
  gap: 10px;
  margin-top: 6px;
}
.modal-actions .active {
  color: var(--amber);
  border-color: var(--amber);
}
.modal-actions .danger:hover {
  color: var(--danger);
  border-color: var(--danger);
}
</style>
