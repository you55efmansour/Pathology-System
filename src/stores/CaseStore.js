import { makeAutoObservable, runInAction } from 'mobx';
import caseService from '@/features/cases/services/caseService';

class CaseStore {
  cases = [];
  loading = true;
  busy = false;
  error = '';
  constructor() { makeAutoObservable(this, {}, { autoBind: true }); }
  async load() {
    this.loading = true; this.error = '';
    try { const cases = await caseService.list(); runInAction(() => { this.cases = cases; }); }
    catch (error) { runInAction(() => { this.error = error.message; }); }
    finally { runInAction(() => { this.loading = false; }); }
  }
  getCase(id) { return this.cases.find((item) => item.id === id); }
  async execute(method, ...args) {
    if (this.busy) throw new Error('busy');
    this.busy = true;
    try {
      const result = await caseService[method](...args);
      const cases = await caseService.list();
      runInAction(() => { this.cases = cases; this.error = ''; });
      return result;
    } finally { runInAction(() => { this.busy = false; }); }
  }
}
export default new CaseStore();
