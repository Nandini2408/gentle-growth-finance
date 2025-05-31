
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
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
				},
				// BudgetBloom Brand Colors
				sage: {
					light: '#A8C488',
					DEFAULT: '#87A96B',
					dark: '#6B8A4F'
				},
				bloom: {
					pink: '#E8B4B8',
					coral: '#F4A261',
					yellow: '#E9C46A'
				},
				category: {
					food: '#FF6B6B',
					transport: '#4ECDC4',
					entertainment: '#45B7D1',
					shopping: '#96CEB4',
					health: '#FFEAA7',
					other: '#DDA0DD'
				},
				// Notification colors
				notification: {
					success: '#52C41A',
					warning: '#FAAD14',
					achievement: '#E9C46A',
					nudge: '#F4A261'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				'heading': ['Poppins', 'system-ui', 'sans-serif'],
				'mono': ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace']
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'lift': {
					'0%': {
						transform: 'translateY(0) scale(1)'
					},
					'100%': {
						transform: 'translateY(-2px) scale(1.02)'
					}
				},
				'bounce-in': {
					'0%': {
						transform: 'scale(0.3)',
						opacity: '0'
					},
					'50%': {
						transform: 'scale(1.05)',
						opacity: '0.8'
					},
					'70%': {
						transform: 'scale(0.9)',
						opacity: '0.9'
					},
					'100%': {
						transform: 'scale(1)',
						opacity: '1'
					}
				},
				'celebration': {
					'0%, 100%': {
						transform: 'rotate(0deg) scale(1)'
					},
					'25%': {
						transform: 'rotate(-5deg) scale(1.1)'
					},
					'75%': {
						transform: 'rotate(5deg) scale(1.1)'
					}
				},
				'pulse-glow': {
					'0%, 100%': {
						boxShadow: '0 0 5px rgba(135, 169, 107, 0.5)'
					},
					'50%': {
						boxShadow: '0 0 20px rgba(135, 169, 107, 0.8)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'lift': 'lift 0.2s ease-out',
				'bounce-in': 'bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
				'celebration': 'celebration 0.6s ease-in-out',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite'
			},
			boxShadow: {
				'soft': '0 2px 12px rgba(0, 0, 0, 0.08)',
				'lift': '0 4px 20px rgba(0, 0, 0, 0.12)',
				'dark': '0 2px 12px rgba(0, 0, 0, 0.3)',
				'dark-lift': '0 4px 20px rgba(0, 0, 0, 0.4)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
