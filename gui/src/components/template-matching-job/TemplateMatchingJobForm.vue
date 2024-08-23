<template>
  <v-dialog v-model="dialog" persistent max-width="700px" @keydown.esc="closeForm">
    <template #activator="{ props }">
      <slot name="activator" v-bind="{ props }">
        <v-btn v-bind="props"> New </v-btn>
      </slot>
    </template>
    <v-card>
      <v-form ref="form" lazy-validation @submit.prevent="submitForm">
        <v-card-title> New template matching job </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-select
                  v-model="documentTemplateIdsSelected"
                  :items="templates"
                  item-title="name"
                  item-value="id"
                  hint="Choose templates"
                  label="Select"
                  :loading="loadingTemplates"
                  multiple
                  persistent-hint
                  :rules="[(v: number[]) => !!v.length || 'This field is required']"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn variant="text" type="button" @click="closeForm">Close</v-btn>
          <v-spacer />
          <v-btn
            color="primary"
            variant="text"
            type="submit"
            :disabled="submitDisabled"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { type ComponentInstance, ref } from 'vue';
import type { VForm } from 'vuetify/components';
import { useApi } from '@/api';
import { useReportingStore } from '@/stores/Reporting.ts';
import { onMounted } from 'vue';
import { useTemplates } from '@/hooks/useTemplates';

const emit = defineEmits<{
  (e: 'template-matching-job-saved'): void;
}>();

defineSlots<{
  activator(props: { props: Record<string, any> }): any;
}>();

const { templates, loadingTemplates, fetchTemplates } = useTemplates();
const documentTemplateIdsSelected = ref<number[]>([]);
const dialog = ref(false);
const form = ref<ComponentInstance<typeof VForm>>();
const api = useApi();
const reportingStore = useReportingStore();
const submitDisabled = ref(false);

function closeForm() {
  dialog.value = false;
}

async function submitForm() {
  if (!form.value) return;

  const result = await form.value.validate();
  if (!result.valid) return;

  try {
    submitDisabled.value = true;
    await api.templateMatchingJob.create({
      document_template_ids: documentTemplateIdsSelected.value,
    });
    documentTemplateIdsSelected.value = [];
    emit('template-matching-job-saved');
    closeForm();
  } catch (error) {
    console.error(error);
    reportingStore.reportError('Failed to save template matching job.');
  } finally {
    submitDisabled.value = false;
  }
}

onMounted(() => {
  fetchTemplates();
});
</script>
