<template>
  <div class="min-h-screen flex items-center justify-center bg-navy-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full text-center space-y-8">
      <h2 class="text-3xl font-military text-white">
        Registration Pending
      </h2>
      
      <div class="bg-navy-800 p-6 rounded-lg shadow-lg">
        <p class="text-gray-300 mb-4">
          Your registration request has been sent for approval. Please check your Discord for further instructions.
        </p>
        
        <p class="text-gray-400 text-sm">
          Once approved, you will be able to log in with your credentials.
        </p>
      </div>

      <div class="mt-6">
        <router-link 
          to="/login" 
          class="text-navy-gold hover:text-navy-gold/80"
        >
          Return to Login
        </router-link>
      </div>
    </div>
  </div>
</template> 