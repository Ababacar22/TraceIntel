import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

const config = defineConfig({
    theme: {
        semanticTokens: {
            colors: {
                bg: {
                    panel: { value: "rgba(11, 13, 23, 0.4)" },
                    element: { value: "rgba(255, 255, 255, 0.05)" },
                },
                border: {
                    glass: { value: "rgba(255, 255, 255, 0.1)" },
                    neon: { value: "rgba(0, 255, 255, 0.6)" },
                },
                text: {
                    primary: { value: "#ffffff" },
                    muted: { value: "rgba(255, 255, 255, 0.6)" },
                    accent: { value: "#00ffff" },
                }
            },
            shadows: {
                neon: { value: "0 0 10px rgba(0, 255, 255, 0.5), 0 0 20px rgba(0, 255, 255, 0.3)" },
                glass: { value: "0 8px 32px 0 rgba(0, 0, 0, 0.37)" }
            }
        },
    },
    globalCss: {
        "html, body": {
            backgroundColor: "#050505",
            color: "text.primary",
            minHeight: "100vh",
        },
    }
})

export const system = createSystem(defaultConfig, config)
