<script setup lang="ts">
import { F2lCaseBrowser } from '@/components'
import { CollapsiblePanel } from '@/components/CollapsiblePanel'

const links = [
  {
    title: 'J Perm — F2L (гайд CFOP)',
    url: 'https://jperm.net/3x3/cfop/f2l',
    note: 'Письмовий розбір інтуїтивного F2L, поради та аркуш алгоритмів.',
  },
  {
    title: 'J Perm — найкращі алгоритми F2L (PDF)',
    url: 'https://jperm.net/algs/f2l',
    note: 'Аркуш алгоритмів для довідки, коли кейси вже зрозумілі інтуїтивно.',
  },
  {
    title: 'J Perm на YouTube',
    url: 'https://www.youtube.com/@jperm',
    note: 'Відеорозбори, включно із серією про F2L та передбачення (look-ahead).',
  },
]
</script>

<template>
  <div>
    <h1>F2L Guide</h1>

    <CollapsiblePanel :default-open="true" label="Гайд з F2L">
      <div class="guide">
        <section class="intro">
          <h2>F2L — Перші два шари</h2>
          <p>
            F2L замінює новачківський крок «розв'язувати ребра середнього шару по одному» на дещо
            набагато швидше: об'єднання кута з відповідним ребром і встановлення їх на місце разом.
            Зроблений добре, цей етап зазвичай займає найбільшу частину часу розв'язання методом
            CFOP — тому це і найбільше місце для приросту швидкості.
          </p>
        </section>

        <section>
          <h3>Основна ідея</h3>
          <p>
            Після хреста чотири пари кут-ребро потрібно встановити в останні чотири пази. Замість
            розв'язування їх як окремих деталей, знайдіть кут і ребро, що мають два спільні кольори,
            об'єднайте їх у пару, використовуючи верхній шар як вільний простір, і вставте пару в її
            паз одним рухом. Більшість кейсів взагалі не потребують завченого алгоритму — вони
            випливають із розуміння невеликого набору повторюваних рухів (це і мають на увазі J Perm
            та більшість швидкісних кубічників під «інтуїтивним F2L»).
          </p>
        </section>

        <section>
          <h3>Як дійсно стати швидшим</h3>
          <ul>
            <li>
              <strong>Спочатку вивчіть це інтуїтивно.</strong> Приділіть час розумінню, чому пара
              збирається і встановлюється саме так, перш ніж братися за аркуш алгоритмів. Алгоритми
              без розуміння розсипаються, щойно кейс виглядає трохи інакше, ніж на картинці.
            </li>
            <li>
              <strong>Уникайте обертань кубика.</strong> Кожне обертання коштує часу на
              розпізнавання. Навчіться відстежувати деталі відносно граней R і F, не обертаючи весь
              хват.
            </li>
            <li>
              <strong>Дивіться наперед.</strong> Поки завершуєте хрест, шукайте поглядом першу пару.
              Поки вставляєте одну пару, вже відстежуйте наступну. Це найбільший важіль для реальної
              швидкості розв'язання, більший за будь-яку заміну алгоритму.
            </li>
            <li>
              <strong>Використовуйте алгоритми як допоміжні колеса.</strong> Коли ваші інтуїтивні
              рішення стабільні (поширений орієнтир — розв'язання менш ніж за 15 секунд), аркуші
              алгоритмів F2L стають корисними — для оптимізації незручних кейсів і вставок у задні
              пази, а не для вивчення етапу з нуля.
            </li>
            <li>
              <strong>Хороше ребро / погане ребро.</strong> Навчіться визначати, чи наліпка кольору
              хреста на деталі показана зверху чи збоку — це змінює, який підготовчий рух збере пару
              без подвійного перевертання ребра.
            </li>
          </ul>
        </section>

        <section class="links">
          <h3>Ресурси</h3>
          <div class="link-list">
            <a
              v-for="l in links"
              :key="l.url"
              :href="l.url"
              target="_blank"
              rel="noopener"
              class="link-card"
            >
              <span class="link-title">{{ l.title }} ↗</span>
              <span class="link-note">{{ l.note }}</span>
            </a>
          </div>
        </section>
      </div>
    </CollapsiblePanel>

    <h2 class="browser-heading">Довідник кейсів</h2>
    <F2lCaseBrowser />
  </div>
</template>

<style scoped>
.guide {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.guide section {
  padding: 6px 4px;
}
.intro p {
  color: var(--text);
  font-size: 1.02rem;
  line-height: 1.6;
  margin: 0;
}
h2 {
  font-size: 1.4rem;
}
h3 {
  font-size: 1.05rem;
  color: var(--accent);
}
p {
  line-height: 1.6;
  color: var(--text);
  opacity: 0.92;
}
ul {
  margin: 0;
  padding-left: 1.2em;
  display: flex;
  flex-direction: column;
  gap: 10px;
  line-height: 1.55;
}
li strong {
  color: var(--text);
}
.link-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.link-card {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 12px 14px;
  border: 1px solid var(--border);
  border-radius: 10px;
  text-decoration: none;
  color: var(--text);
  background: var(--panel-2);
  transition: border-color 0.15s ease;
}
.link-card:hover {
  border-color: var(--accent-dim);
}
.link-title {
  font-weight: 600;
  font-family: var(--font-display);
}
.link-note {
  color: var(--muted);
  font-size: 0.85rem;
}
.browser-heading {
  margin-bottom: 14px;
}
</style>
