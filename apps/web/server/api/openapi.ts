import { generateOpenApiDocument } from 'trpc-swagger';
import { appRouter } from '.';

export const openApiDocument = generateOpenApiDocument(appRouter, {
  title: 'Personal Cloud API Documentation',
  version: '1.0.0',
  baseUrl: 'http://localhost:3000/api',
  tags: ['healthcheck', 'users'],
});
