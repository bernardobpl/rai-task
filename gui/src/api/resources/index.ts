import DocumentTemplateApi from '@/api/resources/DocumentTemplate.ts';
import TemplateMatchingJobApi from './TemplateMatchingJob';
import type { ApiClient } from '@/api';

export default class Api {
  documentTemplate: DocumentTemplateApi;
  templateMatchingJob: TemplateMatchingJobApi;

  constructor(client: ApiClient) {
    this.documentTemplate = new DocumentTemplateApi(client);
    this.templateMatchingJob = new TemplateMatchingJobApi(client);
  }
}
