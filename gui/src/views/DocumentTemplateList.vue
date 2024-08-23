<template>
  <v-container>
    <v-card>
      <v-card-title> Document templates </v-card-title>
      <v-card-text>
        <v-data-table
          ref="dataTable"
          density="compact"
          :headers="headers"
          :loading="loadingTemplates"
          :items="templates"
          :search="search"
          item-value="id"
          multi-sort
          class="mt-10 px-10"
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
              <document-template-form
                :allow-file-upload="true"
                dialog-title="New Document template"
                @document-template-saved="fetchTemplates"
              />
            </v-toolbar>
          </template>
          <template #item.image="{ item }">
            <template-image
              :ref="(el) => setTemplateImageRef(el, item.id)"
              :template-id="item.id"
            />
          </template>
          <template #item.actions="{ item }">
            <div class="d-inline-block text-no-wrap">
              <template-upload-form
                :template-id="item.id"
                @template-updated="() => handleTemplateUpdated(item.id)"
              />
              <document-template-form
                title="Update Document template"
                :edited-template="item"
                @document-template-saved="fetchTemplates"
              >
                <template #activator="{ props }">
                  <v-btn
                    variant="plain"
                    class="pt-1"
                    icon="mdi-border-color"
                    v-bind="props"
                  />
                </template>
              </document-template-form>
              <v-btn
                variant="plain"
                color="red"
                icon="mdi-delete"
                @click="deleteTemplate(item.id)"
              />
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import DocumentTemplateForm from '@/components/document-template/DocumentTemplateForm.vue';
import { type ComponentInstance, ref } from 'vue';
import { useApi } from '@/api';
import { useReportingStore } from '@/stores/Reporting.ts';
import TemplateImage from '@/components/document-template/TemplateImage.vue';
import TemplateUploadForm from '@/components/document-template/TemplateUploadForm.vue';
import type { VDataTable } from 'vuetify/components';
import { useTemplates } from '@/hooks/useTemplates';

const headers = [
  { title: 'Name', align: 'start', sortable: true, key: 'name' },
  { title: 'Image', align: 'center', sortable: false, key: 'image' },
  { title: 'Actions', align: 'end', sortable: false, key: 'actions' },
] as const;

const search = ref('');

const api = useApi();
const reportingStore = useReportingStore();

const { templates, loadingTemplates, fetchTemplates } = useTemplates();

const templateImageRefs = ref<
  Record<string, Element & { loadImageBytes?: () => void }>
>({});

function setTemplateImageRef(el: Element | null, templateId: number) {
  if (el) {
    templateImageRefs.value[`template-image-ref-${templateId}`] = el;
  }
}

const dataTable = ref<ComponentInstance<typeof VDataTable>>();

async function deleteTemplate(templateId: number) {
  try {
    const confirmed = confirm('Are you sure?');
    if (!confirmed) return;

    await api.documentTemplate.delete(templateId);
    await fetchTemplates();
  } catch (e) {
    console.error(e);
    reportingStore.reportError('Failed to delete document template');
  }
}

function handleTemplateUpdated(templateId: number) {
  fetchTemplates();
  const refName = `template-image-ref-${templateId}`;
  const imgElement = templateImageRefs.value[refName];
  if (imgElement) {
    imgElement.loadImageBytes?.();
  }
}
</script>
