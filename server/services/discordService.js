import dotenv from 'dotenv'
import userService from './userService.js'
import client from '../discord-bot.js'

dotenv.config()

// When the client is ready, run this code (only once)
client.once('ready', readyClient => {
  console.log(`✅ Discord bot ready! Logged in as ${readyClient.user.tag}`)
})

// Log any errors
client.on('error', error => {
  console.error('Discord bot error:', error)
})

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return

  const [action, registrationId] = interaction.customId.split(':')
  const registration = await userService.getPendingRegistration(registrationId)

  if (!registration) {
    await interaction.reply({ 
      content: '❌ Registration not found',
      ephemeral: true 
    })
    return
  }

  if (action === 'approve') {
    try {
      // Get the original password from the registration
      const originalPassword = registration.password

      // Create the user account with a fresh hash
      await userService.createUser({
        username: registration.username,
        password: originalPassword, // userService will hash this
        rank: 'E-1',
        role: 'Member',
        permissions: ['MEMBER'],
        discordUsername: registration.discordUsername
      })

      // Remove pending registration
      await userService.removePendingRegistration(registrationId)

      await interaction.reply({
        content: `✅ Registration approved for ${registration.discordUsername}\nYou can now log in to the management system at ${process.env.CLIENT_URL}`
      })
    } catch (error) {
      await interaction.reply({
        content: `❌ Failed to approve registration: ${error.message}`,
        ephemeral: true
      })
    }
  } else if (action === 'deny') {
    await userService.removePendingRegistration(registrationId)
    await interaction.reply({
      content: `❌ Registration denied for ${registration.discordUsername}`
    })
  }
})

export async function sendVerificationMessage(userData) {
  try {
    const channel = await client.channels.fetch(process.env.DISCORD_VERIFICATION_CHANNEL_ID)
    if (!channel) {
      throw new Error('Verification channel not found')
    }

    await channel.send({
      embeds: [{
        color: 0x0099ff,
        title: '🆕 New Access Request',
        description: 'A new user has requested access to the system.',
        fields: [
          {
            name: 'Username',
            value: userData.username,
            inline: true
          },
          {
            name: 'Discord',
            value: userData.discordUsername,
            inline: true
          }
        ],
        timestamp: new Date().toISOString()
      }],
      components: [{
        type: 1,
        components: [
          {
            type: 2,
            style: 3,
            label: '✅ Approve',
            custom_id: `approve:${userData.registrationId}`
          },
          {
            type: 2,
            style: 4,
            label: '❌ Deny',
            custom_id: `deny:${userData.registrationId}`
          }
        ]
      }]
    })

    return true
  } catch (error) {
    console.error('Failed to send verification message:', error)
    throw error
  }
} 