import type { ApiClient } from '@/api';
import type { DocumentTemplateOut } from './DocumentTemplate';

export const JOB_STATE = {
  SUBMITTED: 'SUBMITTED',
  RUNNING: 'RUNNING',
  FAILED: 'FAILED',
  SUCCEEDED: 'SUCCEEDED',
};

export type TemplateMatchingJobState = (typeof JOB_STATE)[keyof typeof JOB_STATE];

export interface TemplateMatchingJobOut {
  id: number;
  created_at: string;
  job_state: string;
  job_id: string;
  document_templates: DocumentTemplateOut[];
}

export interface SampleResult {
  sample_id: number;
  score: number;
}

export interface ResultPerTemplate {
  template_id: number;
  sample_results: SampleResult[];
}

export interface TemplateMatchingJobResults {
  results_per_template: ResultPerTemplate[];
  total_run_time: number;
}

export interface TemplateMatchingJobIn {
  document_template_ids: number[];
}

export interface TemplateMatchingJobRerun {
  defail: Array<{
    loc: [string, number];
    msg: string;
    type: string;
  }>;
}

export default class TemplateMatchingJobApi {
  client: ApiClient;
  pathPrefix: string;

  constructor(client: ApiClient) {
    this.client = client;
    this.pathPrefix = '/template-matching-job/';
  }

  async list(): Promise<TemplateMatchingJobOut[]> {
    return await this.client.get(this.pathPrefix);
  }

  create(params: TemplateMatchingJobIn): Promise<TemplateMatchingJobOut> {
    return this.client.post(this.pathPrefix, params);
  }

  detail(jobId: number): Promise<TemplateMatchingJobOut> {
    return this.client.get(`${this.pathPrefix}${jobId}`);
  }

  delete(jobId: number): Promise<null> {
    return this.client.delete(`${this.pathPrefix}${jobId}`);
  }

  results(jobId: number): Promise<TemplateMatchingJobResults> {
    return this.client.get(`${this.pathPrefix}${jobId}/results`);
  }

  rerun(jobId: number): Promise<TemplateMatchingJobRerun> {
    return this.client.post(`${this.pathPrefix}${jobId}/submit`);
  }
}
