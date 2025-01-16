import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
  },


  {
    rules: {
      'vue/multi-word-component-names': 'off',
      "indent": "off",
      "no-unused-vars": "off"
    },
  }
]
