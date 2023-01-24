import Bee from 'bee-queue';
import CancellationMail from '../app/jobs/CancellationMail';

import redis_conf from '../config/redis';

const jobs = [CancellationMail]

class Queue{
    constructor(){
        this.queues = {}
        this.init()
    }

    init(){
        jobs.forEach(({key, handle}) => { this.queues[key] = {bee: new Bee(key, {redis:redis_conf}), handle}  } )
    }
    
    add(queue, job){
        return this.queues[queue].bee.createJob(job)
    }

    processQueue(){
        jobs.forEach( job => { const{bee, handle} = this.queues[job.key]
        bee.on('failed', this.hadleFailure).process(handle)} )
    }

    hadleFailure(job, error){
        console.log(`Fila ${job.queue.name}:400`, error)
    }
}

export default new Queue();
