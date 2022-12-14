import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { getBabelOutputPlugin } from "@rollup/plugin-babel"
import { terser } from 'rollup-plugin-terser'
import copy from 'rollup-plugin-copy'



export default [
  {
    input: "src/index.js",
    plugins: [
      copy({
        targets: [{
          src: 'src/index.d.ts',
          dest: 'esm'
        }]
      }),
      resolve(),
      commonjs(),
    ],
    output: [
      {
        file: "esm/index.js",
        format: 'es',
        plugins: [getBabelOutputPlugin({
          presets: [['@babel/preset-env', { modules: false }]],
          plugins: [['@babel/plugin-transform-runtime', { useESModules: true }]]
        }), terser()]
      }, {
        file: "lib/index.js",
        format: 'cjs',
        plugins: [
          getBabelOutputPlugin({
          presets: [['@babel/preset-env', { modules: 'cjs' }]],
          plugins: [['@babel/plugin-transform-runtime', { useESModules: false }]]
        }), terser()]
      },
      {
        file: "dist/index.js",
        format: 'umd',
        name: "Wavesurfer",
        plugins: [getBabelOutputPlugin({
          allowAllFormats: true,
          presets: [['@babel/preset-env', { modules: 'umd' }]],
          plugins: [['@babel/plugin-transform-runtime', { useESModules: false }]]
        }), terser()]
      }
    ]
  }
]