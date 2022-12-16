import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { getBabelOutputPlugin } from "@rollup/plugin-babel"
import { terser } from 'rollup-plugin-terser'
import replace from '@rollup/plugin-replace'
import copy from 'rollup-plugin-copy'
import pckg from './package.json'


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
      replace({
        __VERSION__: JSON.stringify(pckg.version)
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