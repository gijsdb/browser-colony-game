import { GameStoreRepoI } from '../../repositories/GameStoreRepo'
import { Job, JobType } from '../entities/Job'

export interface JobServiceI {
  createJob(type: JobType, x: number, y: number, resourceType: string, jobYield: number): Job
  assignJob(colonistId: string): Job | null
  completeJob(jobId: string): void
  update(delta: number): void
  getState(): any
}

export class JobService implements JobServiceI {
  private jobs: Job[] = []

  constructor(private gameStoreRepo: GameStoreRepoI) {}

  update(delta: number) {
    this.jobs = this.jobs.filter((job) => !job.isCompleted)
  }

  createJob(type: JobType, x: number, y: number, resourceType: string, jobYield: number): Job {
    const job = new Job(
      this.generateJobId(),
      type,
      x,
      y,
      this.getJobDuration(type),
      resourceType,
      jobYield
    )
    this.jobs.push(job)
    return job
  }

  assignJob(colonistId: string): Job | null {
    const availableJob = this.jobs.find((job) => !job.assignedColonist)
    if (availableJob) {
      availableJob.assignedColonist = colonistId
    }
    return availableJob || null
  }

  completeJob(jobId: string) {
    const job = this.jobs.find((j) => j.id === jobId)
    if (job) {
      job.isCompleted = true
      this.gameStoreRepo.addResourceToInventory(job.resourceType, job.jobYield)
    }
  }

  getState(): any {
    return {
      jobs: this.jobs.map((job) => job.getState())
    }
  }

  private generateJobId(): string {
    return 'id' + Math.random().toString(16).slice(2)
  }

  private getJobDuration(type: JobType): number {
    // Return duration based on job type
    switch (type) {
      case 'harvest':
        return 5000 // 5 seconds
      case 'build':
        return 10000 // 10 seconds
      default:
        return 3000 // 3 seconds
    }
  }
}
