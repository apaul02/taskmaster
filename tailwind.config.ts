	import type { Config } from "tailwindcss";

	const config: Config = {
			darkMode: ["class"],
			content: [
			"./pages/**/*.{js,ts,jsx,tsx,mdx}",
			"./components/**/*.{js,ts,jsx,tsx,mdx}",
			"./app/**/*.{js,ts,jsx,tsx,mdx}",
		],
		theme: {
        	extend: {
        		fontFamily: {
        			montserrat: ['Montserrat', 'sans-serif'],
        			poppins: ['Poppins', 'sans-serif'],
        			pacifico: ['Pacifico', 'cursive'],
        			caveat: ['Caveat', 'cursive'],
        			yellowtail: ['Yellowtail', 'cursive']
        		},
        		colors: {
        			background: 'hsl(var(--background))',
        			foreground: 'hsl(var(--foreground))',
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
        			},
        			sidebar: {
        				DEFAULT: 'hsl(var(--sidebar-background))',
        				foreground: 'hsl(var(--sidebar-foreground))',
        				primary: 'hsl(var(--sidebar-primary))',
        				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
        				accent: 'hsl(var(--sidebar-accent))',
        				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
        				border: 'hsl(var(--sidebar-border))',
        				ring: 'hsl(var(--sidebar-ring))'
        			}
        		},
        		borderRadius: {
        			lg: 'var(--radius)',
        			md: 'calc(var(--radius) - 2px)',
        			sm: 'calc(var(--radius) - 4px)'
        		},
        		keyframes: {
        			gradientCycle: {
        				'0%, 100%': {
        					backgroundPosition: '0% 50%'
        				},
        				'50%': {
        					backgroundPosition: '100% 50%'
        				}
        			},
        			fadeIn: {
        				'0%': {
        					opacity: '0'
        				},
        				'100%': {
        					opacity: '1'
        				}
        			},
        			slideIn: {
        				'0%': {
        					transform: 'translateY(-100%)',
        					opacity: '0'
        				},
        				'50%': {
        					transform: 'translateY(-50%)',
        					opacity: '0.5'
        				},
        				'100%': {
        					transform: 'translateY(0)',
        					opacity: '1'
        				}
        			},
        			slideLeft: {
        				'0%': {
        					transform: 'translateX(-100%)',
        					opacity: '0'
        				},
        				'50%': {
        					transform: 'translateX(-50%)',
        					opacity: '0.5'
        				},
        				'70%': {
        					transform: 'translateX(10%)',
        					opacity: '1'
        				},
        				'100%': {
        					transform: 'translateX(0)',
        					opacity: '1'
        				}
        			},
        			glowing: {
        				'0%': {
        					backgroundPosition: '0 0'
        				},
        				'50%': {
        					backgroundPosition: '400% 0'
        				},
        				'100%': {
        					backgroundPosition: '0 0'
        				}
        			}
        		},
        		boxShadow: {
        			'inset-black': 'inset 0 0 0 0 	#0000FF',
        			'inset-black-next': 'inset 300px 0 0 0 	#0000FF'
        		},
        		animation: {
        			gradientCycle: 'gradientCycle 5s ease infinite',
        			fadeIn: 'fadeIn 1s ease-out',
        			slideIn: 'slideIn .5s ease-out',
        			slideLeft: 'slideLeft .5s ease-out',
        			'spin-slow': 'spin 10s linear infinite',
        			glowing: 'glowing 20s linear infinite'
        		},
        		backgroundSize: {
        			'200%': '200% 200%'
        		},
        		backgroundImage: {
        			'custom-gradient': 'linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(229,251,255,1) 20%, rgba(103,230,255,1) 43%, rgba(99,222,246,1) 50%, rgba(86,226,255,1) 58%, rgba(210,247,255,1) 83%, rgba(255,255,255,1) 100%)'
        		}
        	}
        },
		plugins: [require("tailwindcss-animate")],
	};
	export default config;
