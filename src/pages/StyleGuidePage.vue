<template>
  <div class="p-style-guide" data-testid="page-style-guide">
    <h1 class="visually-hidden">{{ styleGuideContent.meta.title }}</h1>

    <div class="p-style-guide__container">

      <!-- ── Page header ─────────────────────────────────────────────────── -->
      <header class="p-style-guide__page-header">
        <h2 class="wf-type-eyebrow p-style-guide__page-eyebrow">{{ styleGuideContent.meta.title }}</h2>
        <p class="wf-type-caption p-style-guide__page-subtitle">{{ styleGuideContent.meta.subtitle }}</p>
      </header>

      <!-- ── Section 1: Brand ───────────────────────────────────────────── -->
      <section class="p-style-guide__section" id="brand" aria-labelledby="section-brand">
        <h2 class="p-style-guide__section-heading wf-type-eyebrow" id="section-brand">
          {{ styleGuideContent.sections.brand }}
        </h2>
        <div class="p-style-guide__brand-showcase">
          <AppLogo size="lg" />
          <div class="p-style-guide__brand-text">
            <p class="wf-type-logo">{{ appName }}</p>
            <p class="wf-type-caption">{{ styleGuideContent.meta.subtitle }}</p>
          </div>
        </div>
      </section>

      <!-- ── Section 2: Colour System ──────────────────────────────────── -->
      <section class="p-style-guide__section" id="colours" aria-labelledby="section-colours">
        <h2 class="p-style-guide__section-heading wf-type-eyebrow" id="section-colours">
          {{ styleGuideContent.sections.colours }}
        </h2>

        <!-- Backgrounds group -->
        <h3 class="p-style-guide__group-label wf-type-caption">{{ styleGuideContent.colour.groups.backgrounds }}</h3>
        <div class="p-style-guide__swatch-grid">
          <div
            v-for="key in ['ink', 'base', 'raised', 'panel', 'border'] as const"
            :key="key"
            class="p-style-guide__swatch"
            :style="{ '--swatch-color': styleGuideContent.colour.swatches[key].hex }"
          >
            <div class="p-style-guide__swatch-block" />
            <div class="p-style-guide__swatch-info">
              <span class="p-style-guide__swatch-token font-mono">{{ styleGuideContent.colour.swatches[key].token }}</span>
              <span class="p-style-guide__swatch-hex font-mono">{{ styleGuideContent.colour.swatches[key].hex }}</span>
              <span class="p-style-guide__swatch-use wf-type-caption">{{ styleGuideContent.colour.swatches[key].use }}</span>
            </div>
          </div>
        </div>

        <!-- Text group -->
        <h3 class="p-style-guide__group-label wf-type-caption">{{ styleGuideContent.colour.groups.text }}</h3>
        <div class="p-style-guide__swatch-grid">
          <div
            v-for="key in ['textPri', 'textSec', 'textMuted'] as const"
            :key="key"
            class="p-style-guide__swatch"
            :style="{ '--swatch-color': styleGuideContent.colour.swatches[key].hex }"
          >
            <div class="p-style-guide__swatch-block" />
            <div class="p-style-guide__swatch-info">
              <span class="p-style-guide__swatch-token font-mono">{{ styleGuideContent.colour.swatches[key].token }}</span>
              <span class="p-style-guide__swatch-hex font-mono">{{ styleGuideContent.colour.swatches[key].hex }}</span>
              <span class="p-style-guide__swatch-use wf-type-caption">{{ styleGuideContent.colour.swatches[key].use }}</span>
            </div>
          </div>
        </div>

        <!-- Accent group -->
        <h3 class="p-style-guide__group-label wf-type-caption">{{ styleGuideContent.colour.groups.accent }}</h3>
        <div class="p-style-guide__swatch-grid">
          <div
            v-for="key in ['accentDark', 'accent', 'accentHover'] as const"
            :key="key"
            class="p-style-guide__swatch"
            :style="{ '--swatch-color': styleGuideContent.colour.swatches[key].hex }"
          >
            <div class="p-style-guide__swatch-block" />
            <div class="p-style-guide__swatch-info">
              <span class="p-style-guide__swatch-token font-mono">{{ styleGuideContent.colour.swatches[key].token }}</span>
              <span class="p-style-guide__swatch-hex font-mono">{{ styleGuideContent.colour.swatches[key].hex }}</span>
              <span class="p-style-guide__swatch-use wf-type-caption">{{ styleGuideContent.colour.swatches[key].use }}</span>
            </div>
          </div>
        </div>

        <!-- Feedback group -->
        <h3 class="p-style-guide__group-label wf-type-caption">{{ styleGuideContent.colour.groups.feedback }}</h3>
        <div class="p-style-guide__swatch-grid">
          <div
            class="p-style-guide__swatch"
            :style="{ '--swatch-color': styleGuideContent.colour.swatches.danger.hex }"
          >
            <div class="p-style-guide__swatch-block" />
            <div class="p-style-guide__swatch-info">
              <span class="p-style-guide__swatch-token font-mono">{{ styleGuideContent.colour.swatches.danger.token }}</span>
              <span class="p-style-guide__swatch-hex font-mono">{{ styleGuideContent.colour.swatches.danger.hex }}</span>
              <span class="p-style-guide__swatch-use wf-type-caption">{{ styleGuideContent.colour.swatches.danger.use }}</span>
            </div>
          </div>
        </div>

        <!-- Element palettes -->
        <h3 class="p-style-guide__group-label wf-type-caption">{{ styleGuideContent.colour.groups.elements }}</h3>
        <div class="p-style-guide__element-palettes">
          <div
            v-for="(element, key) in styleGuideContent.colour.elements"
            :key="key"
            class="p-style-guide__element-palette"
          >
            <div class="p-style-guide__element-palette-header">
              <span class="p-style-guide__element-name wf-type-heading">{{ element.label }}</span>
              <span class="p-style-guide__element-flavour wf-type-caption">{{ element.flavour }}</span>
            </div>
            <div class="p-style-guide__element-swatches">
              <div
                v-for="swatchKey in ['base', 'accent', 'bg'] as const"
                :key="swatchKey"
                class="p-style-guide__swatch p-style-guide__swatch--compact"
                :style="{ '--swatch-color': element[swatchKey].hex }"
              >
                <div class="p-style-guide__swatch-block" />
                <div class="p-style-guide__swatch-info">
                  <span class="p-style-guide__swatch-token font-mono">{{ element[swatchKey].token }}</span>
                  <span class="p-style-guide__swatch-hex font-mono">{{ element[swatchKey].hex }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ── Section 3: Typography ──────────────────────────────────────── -->
      <section class="p-style-guide__section" id="typography" aria-labelledby="section-typography">
        <h2 class="p-style-guide__section-heading wf-type-eyebrow" id="section-typography">
          {{ styleGuideContent.sections.typography }}
        </h2>
        <p class="wf-type-caption p-style-guide__section-intro">{{ styleGuideContent.typography.intro }}</p>

        <div class="p-style-guide__type-specimens">

          <!-- Brand / Cinzel specimens -->
          <div
            v-for="(specimen, key) in brandSpecimens"
            :key="key"
            class="p-style-guide__type-row"
          >
            <div class="p-style-guide__type-meta">
              <span class="p-style-guide__type-class font-mono">{{ specimen.label }}</span>
              <span class="p-style-guide__type-desc wf-type-caption">{{ specimen.meta }}</span>
            </div>
            <div class="p-style-guide__type-sample" :class="specimenClasses(specimen.label)">
              {{ styleGuideContent.typography.sampleTextBrand }}
            </div>
          </div>

          <!-- DM Sans specimens -->
          <div
            v-for="(specimen, key) in sansSpecimens"
            :key="key"
            class="p-style-guide__type-row"
          >
            <div class="p-style-guide__type-meta">
              <span class="p-style-guide__type-class font-mono">{{ specimen.label }}</span>
              <span class="p-style-guide__type-desc wf-type-caption">{{ specimen.meta }}</span>
            </div>
            <div class="p-style-guide__type-sample" :class="specimenClasses(specimen.label)">
              {{ styleGuideContent.typography.sampleText }}
            </div>
          </div>

        </div>
      </section>

      <!-- ── Section 4: Spacing ─────────────────────────────────────────── -->
      <section class="p-style-guide__section" id="spacing" aria-labelledby="section-spacing">
        <h2 class="p-style-guide__section-heading wf-type-eyebrow" id="section-spacing">
          {{ styleGuideContent.sections.spacing }}
        </h2>
        <p class="wf-type-caption p-style-guide__section-intro">{{ styleGuideContent.spacing.intro }}</p>

        <div class="p-style-guide__spacing-scale">
          <div
            v-for="(token, key) in styleGuideContent.spacing.tokens"
            :key="key"
            class="p-style-guide__spacing-row"
          >
            <div class="p-style-guide__spacing-labels">
              <span class="p-style-guide__spacing-token font-mono">{{ token.token }}</span>
              <span class="p-style-guide__spacing-value font-mono">{{ token.value }}</span>
            </div>
            <div class="p-style-guide__spacing-track">
              <div
                class="p-style-guide__spacing-bar"
                :style="{ '--bar-width': token.value }"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- ── Section 5: Components ──────────────────────────────────────── -->
      <section class="p-style-guide__section" id="components" aria-labelledby="section-components">
        <h2 class="p-style-guide__section-heading wf-type-eyebrow" id="section-components">
          {{ styleGuideContent.sections.components }}
        </h2>

        <!-- AppHeader kitchen sink -->
        <h3 class="p-style-guide__subsection-heading wf-type-caption">AppHeader</h3>
        <div class="p-style-guide__preview-frame">
          <AppHeader title="Game Menu" />
        </div>

        <!-- AppHeader with back button -->
        <div class="p-style-guide__preview-frame p-style-guide__preview-frame--mt">
          <AppHeader title="Help" :show-back="true" />
        </div>

        <!-- BottomNav kitchen sink -->
        <h3 class="p-style-guide__subsection-heading wf-type-caption">BottomNav</h3>
        <div class="p-style-guide__preview-frame p-style-guide__preview-frame--dark">
          <BottomNav />
        </div>

        <!-- Buttons -->
        <h3 class="p-style-guide__subsection-heading wf-type-caption">{{ styleGuideContent.components.buttons.label }}</h3>
        <div class="p-style-guide__button-row">
          <button class="btn btn-primary">{{ styleGuideContent.components.buttons.primary }}</button>
          <button class="btn btn-secondary">{{ styleGuideContent.components.buttons.secondary }}</button>
          <button class="p-style-guide__btn-ghost btn">{{ styleGuideContent.components.buttons.ghost }}</button>
          <button class="btn btn-danger">{{ styleGuideContent.components.buttons.danger }}</button>
          <button class="btn btn-primary" disabled>{{ styleGuideContent.components.buttons.disabled }}</button>
        </div>

        <!-- Form Inputs -->
        <h3 class="p-style-guide__subsection-heading wf-type-caption">{{ styleGuideContent.components.inputs.label }}</h3>
        <div class="p-style-guide__inputs-row">
          <div class="p-style-guide__input-group">
            <label class="form-label wf-type-label" for="sg-text-input">
              {{ styleGuideContent.components.inputs.textLabel }}
            </label>
            <input
              id="sg-text-input"
              type="text"
              class="form-control"
              :placeholder="styleGuideContent.components.inputs.placeholder"
            />
          </div>
          <div class="p-style-guide__input-group">
            <label class="form-label wf-type-label" for="sg-select">
              {{ styleGuideContent.components.inputs.selectLabel }}
            </label>
            <select id="sg-select" class="form-select">
              <option disabled selected value="">{{ styleGuideContent.components.inputs.selectOpt }}</option>
              <option>Tide</option>
              <option>Gale</option>
              <option>Dune</option>
            </select>
          </div>
        </div>

        <!-- Cards -->
        <h3 class="p-style-guide__subsection-heading wf-type-caption">{{ styleGuideContent.components.cards.label }}</h3>
        <div class="p-style-guide__cards-row">
          <div class="p-style-guide__card p-style-guide__card--raised">
            <p class="wf-type-eyebrow--card wf-type-eyebrow">{{ styleGuideContent.components.cards.eyebrow }}</p>
            <h4 class="wf-type-heading p-style-guide__card-heading">{{ styleGuideContent.components.cards.heading }}</h4>
            <p class="wf-type-body">{{ styleGuideContent.components.cards.bodyText }}</p>
          </div>
          <div class="p-style-guide__card p-style-guide__card--panel">
            <p class="wf-type-eyebrow--card wf-type-eyebrow">{{ styleGuideContent.components.cards.eyebrow }}</p>
            <h4 class="wf-type-heading p-style-guide__card-heading">{{ styleGuideContent.components.cards.heading }}</h4>
            <p class="wf-type-body">{{ styleGuideContent.components.cards.bodyText }}</p>
          </div>
        </div>
      </section>

      <!-- ── Section 6: Elements ────────────────────────────────────────── -->
      <section class="p-style-guide__section" id="elements" aria-labelledby="section-elements">
        <h2 class="p-style-guide__section-heading wf-type-eyebrow" id="section-elements">
          {{ styleGuideContent.sections.elements }}
        </h2>

        <div class="p-style-guide__elements-grid">
          <div
            v-for="(element, key) in styleGuideContent.colour.elements"
            :key="key"
            class="p-style-guide__element-col"
          >
            <p
              class="wf-type-display p-style-guide__element-display"
              :style="{ '--element-color': element.base.hex }"
            >
              {{ element.label }}
            </p>
            <p class="wf-type-body p-style-guide__element-flavour-text">{{ element.flavour }}</p>
            <div class="p-style-guide__element-stack">
              <div
                v-for="swatchKey in ['base', 'accent', 'bg'] as const"
                :key="swatchKey"
                class="p-style-guide__element-swatch"
                :style="{ '--swatch-color': element[swatchKey].hex }"
              >
                <div class="p-style-guide__element-swatch-block" />
                <div class="p-style-guide__element-swatch-labels">
                  <span class="font-mono p-style-guide__element-swatch-token">{{ element[swatchKey].token }}</span>
                  <span class="font-mono p-style-guide__element-swatch-hex">{{ element[swatchKey].hex }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup lang="ts">
import { styleGuideContent } from '@/content'
import { commonContent } from '@/content'
import AppLogo from '@/components/brand/AppLogo.vue'
import AppHeader from '@/components/AppHeader/AppHeader.vue'
import BottomNav from '@/components/BottomNav/BottomNav.vue'

const appName = commonContent.appName

const brandSpecimens = {
  logo:        styleGuideContent.typography.specimens.logo,
  display:     styleGuideContent.typography.specimens.display,
  heading:     styleGuideContent.typography.specimens.heading,
  eyebrow:     styleGuideContent.typography.specimens.eyebrow,
  eyebrowCard: styleGuideContent.typography.specimens.eyebrowCard,
}

const sansSpecimens = {
  bodyLg:  styleGuideContent.typography.specimens.bodyLg,
  body:    styleGuideContent.typography.specimens.body,
  label:   styleGuideContent.typography.specimens.label,
  caption: styleGuideContent.typography.specimens.caption,
}

// For BEM modifier classes like wf-type-eyebrow--card, also add the base class
function specimenClasses(label: string): string[] {
  const modifierIndex = label.indexOf('--')
  if (modifierIndex === -1) return [label]
  return [label.slice(0, modifierIndex), label]
}
</script>

<style lang="scss" src="./StyleGuidePage.scss" />
