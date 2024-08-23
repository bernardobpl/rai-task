<template>
  <v-container>
    <v-card>
      <v-card-title> Template Matching Jobs </v-card-title>
      <v-card-text>
        <v-data-table
          ref="dataTable"
          density="compact"
          :headers="headers"
          :loading="loadingJobs"
          :items="jobs"
          :search="search"
          item-value="id"
          multi-sort
          class="mt-10 px-10 jobs-list-table"
          @click:row="navigateToJobDetail"
        >
          <template #top>
            <v-toolbar flat density="compact">
              <v-text-field
                v-model="search"
                prepend-icon="mdi-magnify"
                label="Search"
                class="ml-1"
                single-line
                hide-details
              />
              <v-spacer />
              <TemplateMatchingJobForm @template-matching-job-saved="fetchJobs" />
            </v-toolbar>
          </template>
          <template #item.actions="{ item }">
            <div class="d-inline-block text-no-wrap">
              <v-btn
                variant="plain"
                icon="mdi-reload"
                @click.stop="rerunJob(item.id)"
              />
              <v-btn
                variant="plain"
                color="red"
                icon="mdi-delete"
                @click.stop="deleteJob(item.id)"
              />
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import TemplateMatchingJobForm from '@/components/template-matching-job/TemplateMatchingJobForm.vue';
import { ref } from 'vue';
import { useApi } from '@/api';
import { useReportingStore } from '@/stores/Reporting.ts';
import type { VDataTable } from 'vuetify/components';
import type { TemplateMatchingJobOut } from '@/api/resources/TemplateMatchingJob';
import { capitalize } from 'lodash';
import { useRouter } from 'vue-router';
import { useJobs } from '@/hooks/useJobs';

const headers = [
  { title: 'ID', align: 'start', sortable: true, key: 'id' },
  {
    title: 'Created At',
    align: 'center',
    sortable: false,
    key: 'created_at',
    value: ({ created_at }: TemplateMatchingJobOut) =>
      new Date(created_at).toLocaleString(),
  },
  {
    title: 'State',
    align: 'end',
    sortable: false,
    key: 'job_state',
    value: ({ job_state }: TemplateMatchingJobOut) => capitalize(job_state),
  },
  { title: 'Actions', align: 'end', sortable: false, key: 'actions' },
] as const;

const api = useApi();
const reportingStore = useReportingStore();
const router = useRouter();

const search = ref('');
const { jobs, loadingJobs, fetchJobs } = useJobs();

async function deleteJob(jobId: number) {
  try {
    const confirmed = confirm('Are you sure?');
    if (!confirmed) return;

    await api.templateMatchingJob.delete(jobId);
    await fetchJobs();
  } catch (e) {
    console.error(e);
    reportingStore.reportError('Failed to delete template matching job');
  }
}

async function rerunJob(jobId: number) {
  try {
    await api.templateMatchingJob.rerun(jobId);
    await fetchJobs();
  } catch (e) {
    console.error(e);
    reportingStore.reportError('Failed to rerun job');
  }
}

function navigateToJobDetail(_: unknown, data: { item: TemplateMatchingJobOut }) {
  const jobId = data.item.id;
  router.push(`/job-detail/${jobId}`);
}
</script>

<style>
.jobs-list-table .v-data-table__tr--clickable:hover {
  background-color: #eee;
}
</style>
