import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const githubPagesBasePath = '/htmd/'
    return {
        base: mode === 'production' ? githubPagesBasePath : '/',
        build: {
           rollupOptions: {
             output: {
               manualChunks(id) {
                 if (id.includes('codemirror')) {
                    return 'codemirror';
                  }
                },
             },
           },
         },
    }
})