import { defineConfig, splitVendorChunkPlugin } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const githubPagesBasePath = '/htmd/'
    return {
        base: mode === 'production' ? githubPagesBasePath : '/',
        plugins: [splitVendorChunkPlugin()],
        build: {
           rollupOptions: {
             output: {
               manualChunks(id) {
                 if (id.includes('asciidoctor')) {
                   return '@asciidoctor';
                 }
                 if (id.includes('codemirror')) {
                    return '@codemirror';
                  }
                },
             },
           },
         },
    }
})