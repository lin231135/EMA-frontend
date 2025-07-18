# Imagen oficial de Bun
FROM oven/bun:1.1.13

# Directorio de trabajo
WORKDIR /app

# Copiar todos los archivos al contenedor
COPY . .

# Instalar dependencias
RUN bun install

# Exponer puerto de desarrollo de Vite
EXPOSE 5173

# Comando para iniciar Vite con acceso externo
CMD ["bun", "run", "dev", "--host"]