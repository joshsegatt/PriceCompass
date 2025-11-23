import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../server/src/app.module';
import express from 'express';

const server = express();

const createNestServer = async (expressInstance) => {
    const app = await NestFactory.create(
        AppModule,
        new ExpressAdapter(expressInstance),
    );
    app.enableCors({ origin: true, credentials: true });
    await app.init();
};

export default async function handler(req, res) {
    if (!server.listeners('request').length) {
        await createNestServer(server);
    }
    server(req, res);
}
