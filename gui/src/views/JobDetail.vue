<template>
  <div v-if="renderNotFound">
    <v-card-title> Job Not Found </v-card-title>
  </div>
  <v-container v-else>
    <v-card v-if="!loadingJobDetail">
      <v-card-title> Job Detail </v-card-title>
      <div style="display: flex">
        <v-card-text> Name: {{ `job_name_${jobDetail.id}` }}</v-card-text>
        <v-card-text> ID: {{ jobDetail.id }}</v-card-text>
        <v-card-text> State: {{ jobDetail.job_state }}</v-card-text>
        <v-card-text>
          Created At:
          {{ new Date(jobDetail.created_at).toLocaleString() }}</v-card-text
        >
      </div>
      <v-card-text> Templates: {{ templatesUsed }} </v-card-text>
    </v-card>
    <v-skeleton-loader v-else type="card"></v-skeleton-loader>

    <v-card v-if="showResults" class="mt-6">
      <v-card-title> Results </v-card-title>
      <v-card-text>
        <v-expansion-panels class="mb-6">
          <v-expansion-panel
            v-for="templateResult in resultsPerTemplate"
            :key="templateResult.template_id"
          >
            <v-expansion-panel-title expand-icon="mdi-menu-down">
              {{
                templatesObj[templateResult.template_id]?.name || 'Unknown template'
              }}
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-data-table
                density="compact"
                :headers="headers"
                :loading="loadingInProgress"
                :items="templateResult.sample_results"
                item-value="id"
                multi-sort
                class="mt-10 px-10 jobs-detail-table"
              />
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
    </v-card>
    <v-skeleton-loader v-else-if="loadingJobResults" type="card"></v-skeleton-loader>
  </v-container>
</template>

<script setup lang="ts">
import type { DocumentTemplateOut } from '@/api/resources/DocumentTemplate';
import { JOB_STATE } from '@/api/resources/TemplateMatchingJob';
import type {
  ResultPerTemplate,
  SampleResult,
} from '@/api/resources/TemplateMatchingJob';
import { useJobDetail } from '@/hooks/useJobDetail';
import { useTemplates } from '@/hooks/useTemplates';
import { useJobResults } from '@/hooks/useJobResults';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const headers = [
  {
    title: 'Name',
    align: 'start',
    sortable: false,
    key: 'sample_id',
    value: ({ sample_id }: SampleResult) => `sample_name_${sample_id}`,
  },
  {
    title: 'Score',
    align: 'end',
    sortable: false,
    key: 'job_state',
    value: ({ score }: SampleResult) => `${Math.round(score * 100)}%`,
  },
] as const;

const route = useRoute();

const jobId = route.params.jobId;
const isValidJobId = computed(() => !Number.isNaN(Number(jobId)));

const { jobDetail, loadingJobDetail } = useJobDetail(Number(jobId), {
  enabled: isValidJobId,
});
const isJobSucceeded = computed(
  () => jobDetail.value.job_state === JOB_STATE.SUCCEEDED,
);
const { jobResults, loadingJobResults } = useJobResults(Number(jobId), {
  enabled: isJobSucceeded,
});
const { templates, loadingTemplates } = useTemplates({
  enabled: isJobSucceeded, // when rendering results, we need to fetch templates to get the names
});

const resultsPerTemplate = computed(
  () => jobResults.value.results_per_template || ([] as ResultPerTemplate[]),
);

const templatesObj = computed<Record<number, DocumentTemplateOut>>(() =>
  templates.value
    ? Object.fromEntries(templates.value.map((template) => [template.id, template]))
    : {},
);

const jobExist = computed(() => jobDetail.value.id !== undefined);
const renderNotFound = computed(() => !jobExist.value || !isValidJobId.value);

const templatesUsed = computed(
  () =>
    jobDetail.value.document_templates &&
    jobDetail.value.document_templates.map((template) => template.name).join(', '),
);

const loadingInProgress = computed(
  () => loadingJobDetail.value || loadingJobResults.value || loadingTemplates.value,
);

const showResults = computed(() => !loadingJobResults.value && isJobSucceeded.value);
</script>

<style>
.jobs-detail-table .v-data-table__tr:hover {
  background-color: #eee;
}
</style>
