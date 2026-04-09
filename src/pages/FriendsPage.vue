<script setup lang="ts">
import { friendsContent } from '@/content/friends'
</script>

<template>
  <div class="p-friends" data-testid="page-friends">
    <h1 class="visually-hidden">{{ friendsContent.title }}</h1>
  </div>
</template>

<style lang="scss" src="./FriendsPage.scss" />
