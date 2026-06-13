import express from 'express';
import { createApp } from "../src/app";

const app = createApp();


app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Vercel function is alive' });
});

export default app;