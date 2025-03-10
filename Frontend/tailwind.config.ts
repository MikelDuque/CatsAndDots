import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
  	extend: {
			backgroundImage: {
				background: 'var(--background)',
				bots_card: 'var(--bots-card)',
				cats_card: 'var(--cats-card)'
			},
			textShadow: {
				titleShadow: '0 1px 2px var(--foreground)'
			},
  		colors: {
  			background: 'var(--background)',
  			foreground: 'hsl(var(--foreground))',
				invert_foreground: 'hsl(var(--invert-foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
			fontFamily: {
				jersey_10: ['var(--font-jersey10)', 'Poppins', 'sans'],
				audiowide: ['Audiowide', 'Poppins', 'sans'],
				ribeye: ['Ribeye', 'Poppins', 'sans'],
				poppins: ['var(--font-poppins)', 'sans'],
				roboto: ['var(--font-roboto-serif)', 'Vollkorn', 'sans-serif'],
			},
			rotate: {
        '30': '30deg', 
        '-30': '-30deg', 
				'180': '180deg',
      }
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
