import { Client, GatewayIntentBits } from 'discord.js'

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
})

// Debug logging
client.once('ready', () => {
  console.log('=== Discord Bot Debug Info ===')
  console.log('Bot user:', client.user?.tag)
  console.log('Connected to servers:', client.guilds.cache.size)
})

// Test the bot connection
const TOKEN = 'MTMzODYwNTA4MTE3MTMzMzIwMw.GOq-km.v8d2pKKohGJ6KCGGPVEo-YYjSy3S3ZCqWfqetY' // We'll remove this after testing

console.log('=== Attempting Bot Login ===')
console.log('Using direct token:', TOKEN.slice(0, 10) + '...')

client.login(TOKEN)
  .then(() => {
    console.log('✅ Bot login successful')
  })
  .catch(error => {
    console.error('❌ Bot login failed:', {
      error: error.message,
      code: error.code,
      name: error.name
    })
  })

export default client 