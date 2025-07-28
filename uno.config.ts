import { defineConfig } from 'unocss'

export default defineConfig({
  // ...UnoCSS options
  theme: {
    colors: {
      'primary': '#00CFFF',
      'secondary-grey': '#898989',
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
