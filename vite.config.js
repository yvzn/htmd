import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const githubPagesBasePath = '/html-to-markdown/'
    return {
        base: mode === 'production' ? githubPagesBasePath : '/',
    }
})