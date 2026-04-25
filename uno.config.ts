import { defineConfig } from 'unocss'

export default defineConfig({
  // ...UnoCSS options
  theme: {
    colors: {
      'primary': '#00CFFF',
      'secondary-grey': '#898989',
      'ink': '#f5f1e8',
      'teal': '#2bb5ce',
      'teal-deep': '#1a7a8f',
      'danger-soft': '#d68a8a',
    },
  },
  shortcuts: [
    {
      'fit': 'w-full h-full',
      'flex-col': 'flex flex-col',
      'flex-center': 'flex justify-center items-center',
    },
  ],
})
