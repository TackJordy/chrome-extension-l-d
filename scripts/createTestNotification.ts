import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
)

// Function to create a notification
async function createNotification(title: string, message: string, priority: number = 1) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        title,
        message,
        priority,
        read: false,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    console.log('Created notification:', data)
    return data
  } catch (error) {
    console.error('Error creating notification:', error)
    throw error
  }
}

// Example usage:
async function simulateIncomingNotifications() {
  // Simulate a build notification
  await createNotification(
    'Build Complete',
    'Your project build has completed successfully',
    1
  )

  // Wait 2 seconds
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Simulate a high-priority security alert
  await createNotification(
    'Security Alert',
    'Critical security update required for your dependencies',
    2
  )

  // Wait 2 seconds
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Simulate a low-priority info message
  await createNotification(
    'Daily Stats',
    'Your daily performance metrics are now available',
    0
  )
}

// Run the simulation if this script is executed directly
if (require.main === module) {
  simulateIncomingNotifications()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Simulation failed:', error)
      process.exit(1)
    })
} 