/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
       
        "grayText": "#626562",
        "grayBg": "#EFEFEF",
        "warning": "#F46262",
        "warningHover": "#f8a0a0",
        "Input":  "rgba(67, 65, 88, 0.13)",
        "Input2": "#F5F5F5",
        "textBlack13": "rgba(0, 0, 0, 0.23);",
        "button": "#FECB29",
        "buttonHover": "#FFFDD8",
        "divY": "#fffae5",
        "divX": "#ffee99",
        "amarelo": "#ffe433",
      },
      width: {        
        "492": "30rem",
        "471": "29.4375rem",
        "462": "28.875rem",
       
        
      },
      height: {    
        "492": "30rem",    
        "471": "29.4375rem",
        "462": "28.875rem",
        
        
      },
      backgroundImage: {
        "logo": "url(/images/logo.png)",
        "logo2": "url(/images/logoUTFPR.png)"
      },
    },
  },
  plugins: [
    require( '@tailwindcss/line-clamp' ),
  ],
}
