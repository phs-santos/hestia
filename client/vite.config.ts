import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, path.resolve(__dirname, "../"));

	return {
		envDir: './../',
		server: {
			host: true,
			port: Number(env.VITE_API_CLIENT_PORT),
			proxy: {
				"/api": {
					target: `http://localhost:${env.VITE_API_SERVER_PORT}`,
					changeOrigin: true,
				},
			}
		},
		plugins: [react()],
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
			},
		},
	}
});
