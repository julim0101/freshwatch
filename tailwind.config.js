export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        /* CJ CI 계열 근사값 — 공식 가이드 확보 시 교체 */
        brand: {
          50: "#FFF1F2", 100: "#FFE1E4", 200: "#FFC5CB",
          400: "#FF5C77", 500: "#F0284A", 600: "#E4002B", 700: "#BE0024", 900: "#770016",
        },
        /* CJ 블로섬 3색 — 레드(주색) · 오렌지(중간경고) · 블루(AI·예측) */
        cjorange: { 50: "#FFF4E8", 100: "#FFE4C4", 500: "#F58220", 600: "#D96B00", 700: "#A85200" },
        cjblue: { 50: "#EAF4FC", 100: "#CFE6F8", 500: "#1E88CB", 600: "#0072BC", 700: "#005A96" },
      },
      fontFamily: {
        sans: ["Pretendard", "-apple-system", "BlinkMacSystemFont", "Malgun Gothic", "sans-serif"],
      },
      keyframes: {
        "fade-up": { "0%": { opacity: 0, transform: "translateY(10px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
        "slide-in": { "0%": { opacity: 0, transform: "translateY(16px) translateX(-50%)" }, "100%": { opacity: 1, transform: "translateY(0) translateX(-50%)" } },
        shimmer: { "100%": { transform: "translateX(100%)" } },
      },
      animation: {
        "fade-up": "fade-up .5s ease-out both",
        "slide-in": "slide-in .35s ease-out both",
      },
    },
  },
  plugins: [],
};
