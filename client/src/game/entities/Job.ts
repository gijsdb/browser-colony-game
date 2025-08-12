export type JobType = 'harvest' | 'build'

export class Job {
  constructor(
    public id: string,
    public type: JobType,
    public x: number,
    public y: number,
    public duration: number,
    public resourceType: string,
    public jobYield: number
  ) {}

  progress: number = 0
  assignedColonist: string | null = null
  isCompleted: boolean = false

  getState() {
    return {
      id: this.id,
      type: this.type,
      x: this.x,
      y: this.y,
      progress: this.progress,
      duration: this.duration,
      assignedColonist: this.assignedColonist,
      isCompleted: this.isCompleted,
      resourceType: this.resourceType,
      jobYield: this.jobYield
    }
  }
}
