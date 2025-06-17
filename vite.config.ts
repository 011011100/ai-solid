import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import tailwindcss from "@tailwindcss/vite";
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
    plugins: [
        solid(),
        tailwindcss(),
        // 自动引入图标组件
        AutoImport({
            resolvers: [IconsResolver({ prefix: 'Icon' })],
            dts: './auto-imports.d.ts',
        }),
        Icons({
            compiler: 'solid', // 使用 solid 编译器
            autoInstall: true, // 自动安装缺少的图标库
        }),
    ],
})
