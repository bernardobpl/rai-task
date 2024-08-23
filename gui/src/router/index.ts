import { createRouter, createWebHistory } from 'vue-router';
import DocumentTemplateList from '@/views/DocumentTemplateList.vue';
import JobsList from '@/views/JobsList.vue';
import JobDetail from '@/views/JobDetail.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/document-template',
      name: 'DocumentTemplateList',
      component: DocumentTemplateList,
    },
    {
      path: '/template-matching-jobs/',
      name: 'JobsList',
      component: JobsList,
    },
    {
      path: '/job-detail/:jobId',
      name: 'JobDetail',
      component: JobDetail,
    },
  ],
});

export default router;
