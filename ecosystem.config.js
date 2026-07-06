module.exports = {
  apps: [
    {
      name: "app",
      script: "./app.js",
      instances: "max",        // Utiliza todos los núcleos de CPU disponibles automáticamente (2 en tu Lightsail)
      exec_mode: "cluster",    // Habilita el modo Cluster para balancear la carga entre las CPUs
      watch: false,            // Desactivado en producción para evitar reinicios por cambios temporales de archivos
      max_memory_restart: "1G", // Si un proceso supera 1GB de RAM (fuga de memoria), PM2 lo reinicia de forma segura
      env: {
        NODE_ENV: "production",
      }
    }
  ]
};
