import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'
import externalGlobals from "rollup-plugin-external-globals";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {

        target: 'esnext',
        outDir: 'dist',
        minify: 'terser',
        // minify: false,


        sourcemap: true,
        // cssMinify: "lightningcss",    // css拆分
        terserOptions: {
            compress: {
                // 生产环境时移除console.log调试代码
                drop_console: true,
                drop_debugger: true,

                // 移除未使用变量、函数等
                unused: true,
                dead_code: true,
                // pure_funcs: ['console.log'],
            },
            format: {
                comments: false, // 去除注释
                ie8: false,                // 不兼容 IE8
                quote_style: 1             // 使用单引号
            },
        },


        rollupOptions: {
            treeshake: true,    // 摇掉无用代码

            // 外部
            external: ['react', 'react-dom'],

            plugins: [
                externalGlobals({
                    react: "React",
                    "react-dom": "ReactDOM"
                }),
            ],

            output: {
                // globals: {
                //     react: 'React',
                //     'react-dom': 'ReactDOM',
                // },

                // 智能代码分割
                // manualChunks: {
                //     react: ['react', 'react/jsx-runtime', 'react-dom', 'react-router-dom'],
                //     antd: ['antd', '@ant-design/icons'],
                //     routes: ['@/routes/index.tsx'],
                // },


                chunkFileNames: 'js/[name]-[hash].js', // 引入文件名的名称
                entryFileNames: 'js/[name]-[hash].js', // 包的入口文件名称
                assetFileNames: '[ext]/[name]-[hash].[ext]', // 资源文件像 字体，图片等

            },
        }
    }
})
