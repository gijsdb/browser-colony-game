import { eventBus } from '../../eventBus'
import { GameStoreRepoI } from '../../repositories/GameStoreRepo'
import { Job, JobType } from '../entities/Job'
import { ResourceServiceI } from './Resource'

export interface JobServiceI {
  createJob(type: JobType, x: number, y: number, jobYield: number): Job
  assignJob(colonistId: string): Job | null
  completeJob(jobId: string): void
  update(delta: number): void
  getState(): any
}

export class JobService implements JobServiceI {
  private jobs: Job[] = []
  // will need the resource service to handle the actual resource removal and inventory addition
  constructor(
    private gameStoreRepo: GameStoreRepoI,
    private resourceService: ResourceServiceI
  ) {}

  update(delta: number) {
    this.jobs = this.jobs.filter((job) => !job.isCompleted)
  }

  createJob(type: JobType, x: number, y: number, jobYield: number): Job {
    // Needs resource ID or reference to the resource entity..
    let resource = this.resourceService.getResourceByXY(x, y)
    const job = new Job(
      this.generateJobId(),
      type,
      x,
      y,
      this.getJobDuration(type),
      resource!.id || 0, // Fallback to 0 if resource is not found Not ideal
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
      if (job.type === 'harvest') {
        let resource = this.resourceService.getResourceById(job.resourceID)
        this.resourceService.harvestResource(resource!)
      }
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
