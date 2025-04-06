module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#f05742",
        light: "#f9f8f8",
        dark: "#010506",
        "primary-light": "#f37a69",
        "primary-dark": "#d43d28",
        "light-soft": "#f4f3f3",
        "dark-soft": "#1a1e1f",
      },
      fontFamily: {
        anton: ["Anton", "sans-serif"], // Add Anton
        
        "rubik-dirt": ["Rubik Dirt", "cursive"],
      },
      borderRadius: {
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(1, 5, 6, 0.05)",
        DEFAULT: "0 2px 4px 0 rgba(1, 5, 6, 0.08)",
        md: "0 4px 6px -1px rgba(1, 5, 6, 0.1), 0 2px 4px -1px rgba(1, 5, 6, 0.06)",
        lg: "0 10px 15px -3px rgba(1, 5, 6, 0.1), 0 4px 6px -2px rgba(1, 5, 6, 0.05)",
        xl: "0 20px 25px -5px rgba(1, 5, 6, 0.1), 0 10px 10px -5px rgba(1, 5, 6, 0.04)",
        "2xl": "0 25px 50px -12px rgba(1, 5, 6, 0.25)",
        inner: "inset 0 2px 4px 0 rgba(1, 5, 6, 0.06)",
      },
      ringColor: {
        DEFAULT: "rgba(240, 87, 66, 0.5)",
      },
      ringOffsetColor: {
        DEFAULT: "#f9f8f8",
      },
      animation: {
        shimmer: "shimmer 2s infinite linear",
        float: "float 4s ease-in-out infinite",
        "pulse-soft": "pulse 3s infinite",
        "spin-slow": "spin 3s linear infinite",
        "bounce-soft": "bounce 3s infinite",
      },
      transitionDuration: {
        "400": "400ms",
        "2000": "2000ms",
      },
      transitionTimingFunction: {
        "bounce-soft": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(to right, var(--tw-gradient-stops))",
        "gradient-primary-vertical": "linear-gradient(to bottom, var(--tw-gradient-stops))",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};