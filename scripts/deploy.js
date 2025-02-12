#!/usr/bin/env node
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

async function deploy() {
  try {
    console.log('🚀 Starting deployment...')

    // Build the application
    console.log('\n📦 Building application...')
    await execAsync('npm run build')

    // Deploy to Cloudflare
    console.log('\n☁️  Deploying to Cloudflare...')
    await execAsync('wrangler publish')

    console.log('\n✅ Deployment complete!')
  } catch (error) {
    console.error('\n❌ Deployment failed:', error)
    process.exit(1)
  }
}

deploy() 