/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        background: 'green',
        container:{
          primary: '#03364B',
          secondary: '#012939',
        },
        green:{
          primary: '#75D63A',
          header: '#044640'
        },
        blue:{
          primary: '#3E9EF5'
        }
      }
    },
  },
  plugins: [],
}

