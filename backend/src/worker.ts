import 'dotenv/config'
import mongoose from 'mongoose'
import { Worker, Job } from 'bullmq'
import Redis from 'ioredis'
import fs from 'fs'
import { redisConnection, QUEUE_NAME, GenerationJobData } from './lib/queue'
import { Assignment, QuestionPaper } from './models'
import { generateQuestionPaper } from './lib/ai'

// Publisher — separate connection from subscriber
const publisher = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
  tls: process.env.REDIS_URL?.startsWith('rediss://') ? {} : undefined,
})

function publish(assignmentId: string, payload: Record<string, unknown>) {
  publisher.publish('ws:notify', JSON.stringify(payload)).catch(console.error)
}

async function main() {
  // Connect to MongoDB
  await mongoose.connect(process.env.MONGODB_URI || 'your_mongodb_atlas_uri')
  console.log('✅ Worker connected to MongoDB')

  const worker = new Worker<GenerationJobData>(
    QUEUE_NAME,
    async (job: Job<GenerationJobData>) => {
      const { assignmentId, questionTypes, additionalInstructions, fileName } = job.data
      console.log(`[Worker] Processing job ${job.id} for assignment ${assignmentId}`)

      // 1. Update assignment status → processing
      await Assignment.findByIdAndUpdate(assignmentId, { status: 'processing' })
      publish(assignmentId, {
        type: 'status',
        assignmentId,
        status: 'processing',
        message: 'Generating your question paper...',
      })

      // 2. Try to read file content (TXT files only)
      let fileContent: string | undefined
      if (fileName) {
        const uploadsDir = 'uploads'
        try {
          // Find the file matching the original name
          const files = fs.readdirSync(uploadsDir)
          // Match by original name suffix or direct path from DB
          const assignment = await Assignment.findById(assignmentId)
          if (assignment?.fileUrl) {
            const filePath = assignment.fileUrl.replace('/uploads/', `${uploadsDir}/`)
            if (fs.existsSync(filePath)) {
              const ext = filePath.split('.').pop()?.toLowerCase()
              if (ext === 'txt') {
                fileContent = fs.readFileSync(filePath, 'utf-8').slice(0, 4000)
                console.log(`[Worker] Read file content: ${fileContent.length} chars`)
              }
            }
          }
        } catch (e) {
          console.warn('[Worker] Could not read file content:', e)
        }
      }

      // 3. Call AI
      await job.updateProgress(30)
      const paper = await generateQuestionPaper(
        questionTypes,
        additionalInstructions,
        fileName,
        fileContent
      )

      // 4. Store result in MongoDB
      await job.updateProgress(80)
      const qp = await QuestionPaper.create({
        assignmentId,
        schoolName: 'Delhi Public School, Sector-4, Bokaro',
        subject: paper.subject,
        className: paper.className,
        timeAllowed: paper.timeAllowed,
        totalMarks: paper.totalMarks,
        sections: paper.sections,
        answerKey: paper.answerKey,
      })

      // 5. Update assignment status → completed
      await Assignment.findByIdAndUpdate(assignmentId, { status: 'completed' })
      await job.updateProgress(100)

      // 6. Notify frontend via Redis Pub/Sub → WebSocket
      publish(assignmentId, {
        type: 'completed',
        assignmentId,
        paperId: qp._id.toString(),
        message: 'Question paper ready!',
      })

      console.log(`[Worker] ✅ Done: assignment ${assignmentId} → paper ${qp._id}`)
      return { paperId: qp._id.toString() }
    },
    { connection: redisConnection, concurrency: 3 }
  )

  worker.on('failed', async (job, err) => {
    console.error(`[Worker] ❌ Job ${job?.id} failed:`, err.message)
    if (job?.data.assignmentId) {
      await Assignment.findByIdAndUpdate(job.data.assignmentId, { status: 'failed' })
      publish(job.data.assignmentId, {
        type: 'failed',
        assignmentId: job.data.assignmentId,
        message: err.message,
      })
    }
  })

  console.log(`✅ Worker listening on queue: ${QUEUE_NAME}`)
}

main().catch((err) => {
  console.error('Worker startup error:', err)
  process.exit(1)
})
