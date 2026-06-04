<script setup lang="ts">
import ProfileStatsCards from '@/features/profile/components/profile-stats-cards.vue'
import RecentActivityList from '@/features/profile/components/recent-activity-list.vue'
import TopStationsList from '@/features/profile/components/top-stations-list.vue'
import { useProfileDashboard } from '@/features/profile/composables/use-profile-dashboard'
import PageHeader from '@/shared/components/page-header.vue'

const {
  stats,
  isStatsLoading,
  statsError,
  recentEntries,
  isRecentLoading,
  recentError,
} = useProfileDashboard()
</script>

<template>
  <section class="page">
    <PageHeader title="Profile" subtitle="Your listening dashboard" />

    <ProfileStatsCards :stats="stats" :is-loading="isStatsLoading" :error="statsError" />
    <TopStationsList :stats="stats" :is-loading="isStatsLoading" :error="statsError" />
    <RecentActivityList
      :entries="recentEntries"
      :is-loading="isRecentLoading"
      :error="recentError"
    />
  </section>
</template>

<style scoped lang="scss">
@use '@/shared/styles/page';
</style>
