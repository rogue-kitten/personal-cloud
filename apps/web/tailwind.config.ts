import type { Config } from 'tailwindcss';
import { withUt } from 'uploadthing/tw';

const config: Config = withUt({
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backdropBlur: {
        '15': '15px',
      },
      backdropSaturate: {
        '86': '86%',
      },
      backgroundImage: {
        'profile-gradient':
          'radial-gradient(circle at 100% 0, hsla(0, 0%, 100%, .85) 0, hsla(0, 0%, 96.1%, .13) 183%)',
      },
      colors: {
        hover_grey: '#e8e8edcc',
      },
    },
  },
  plugins: [],
});
export default config;
