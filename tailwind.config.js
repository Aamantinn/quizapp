/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/*.{html,js}"],
  theme: {
    extend: {},
    fontFamily: {
      got: ["got", "sans-serif"],

    },
    colors: {
     primary: '#C52233', 
     white: '#FFFFFF',
     green: '#00A651',
     red: '#FF0000',
     secondary: '#F9DCE0',
    }
  },
  plugins: [],
}

