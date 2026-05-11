const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    DisconnectReason, 
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const flowController = require('../logic/flow');

const { supabase } = require('./supabase');
const fs = require('fs');
const path = require('path');

const os = require('os');

// Use a directory outside the project to avoid Windows file locks from editor/indexers
const AUTH_BASE_DIR = path.join(os.homedir(), '.bookbot_auth');

class WhatsAppManager {
    constructor() {
        this.sessions = new Map();
        this.logger = pino({ level: 'info' });
        
        if (!fs.existsSync(AUTH_BASE_DIR)) {
            fs.mkdirSync(AUTH_BASE_DIR, { recursive: true });
        }
    }

    async loadExistingSessions(io) {
        if (!fs.existsSync(AUTH_BASE_DIR)) return;

        const folders = fs.readdirSync(AUTH_BASE_DIR);
        for (const businessId of folders) {
            console.log(`[System] Auto-resuming session for ${businessId}...`);
            await this.initSession(businessId, io).catch(err => {
                console.error(`Failed to resume session for ${businessId}:`, err.message);
            });
        }
    }


    async initSession(businessId, io, force = false) {
        if (this.sessions.has(businessId) && !force) {
            console.log(`[${businessId}] Session already exists, returning existing.`);
            return this.sessions.get(businessId);
        }

        if (force && this.sessions.has(businessId)) {
            console.log(`[${businessId}] Force re-init: Purging old session...`);
            await this.logoutSession(businessId, io);
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        console.log(`[${businessId}] Initializing new WhatsApp session...`);
        
        const sessionPath = path.join(AUTH_BASE_DIR, businessId);
        const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
        
        try {
            const { version } = await fetchLatestBaileysVersion();

            const sock = makeWASocket({
                version,
                logger: this.logger,
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, this.logger),
                },
                printQRInTerminal: false,
                browser: ["BookBot", "Chrome", "1.0.0"]
            });

            sock.ev.on('connection.update', async (update) => {
                const { connection, lastDisconnect, qr } = update;
                
                if (qr) {
                    console.log(`[${businessId}] QR Code generated`);
                    io.to(businessId).emit('whatsapp.qr', qr);
                }

                if (connection === 'close') {
                    const statusCode = lastDisconnect?.error?.output?.statusCode;
                    const shouldReconnect = statusCode !== DisconnectReason.loggedOut && statusCode !== 401;
                    
                    console.log(`[${businessId}] Connection closed. Status: ${statusCode}, Reconnecting: ${shouldReconnect}`);
                    
                    if (statusCode === 401 || statusCode === DisconnectReason.loggedOut) {
                        console.log(`[${businessId}] Session invalidated. Clearing data...`);
                        try {
                            if (fs.existsSync(sessionPath)) {
                                fs.rmSync(sessionPath, { recursive: true, force: true });
                            }
                        } catch (e) {
                            console.error('Failed to clear session path:', e);
                        }
                        this.sessions.delete(businessId);
                        setTimeout(() => this.initSession(businessId, io), 1000);
                    } else if (shouldReconnect) {
                        this.sessions.delete(businessId);
                        this.initSession(businessId, io);
                    } else {
                        this.sessions.delete(businessId);
                        io.to(businessId).emit('whatsapp.status', 'disconnected');
                    }
                }
                else if (connection === 'open') {
                    console.log(`[${businessId}] Connection opened successfully`);
                    
                    // Self-healing: Ensure business exists in DB
                    try {
                        const { data: business } = await supabase.from('businesses').select('id').eq('id', businessId).single();
                        if (!business) {
                            console.log(`[${businessId}] Business not found in DB, creating profile...`);
                            await supabase.from('businesses').insert([{
                                id: businessId,
                                name: "My New Business",
                                email: "owner@example.com"
                            }]);
                        }
                    } catch (e) {
                        console.error(`[${businessId}] Failed to verify/create business profile:`, e.message);
                    }

                    io.to(businessId).emit('whatsapp.status', 'connected');
                }

            });

            sock.ev.on('creds.update', () => {
                try {
                    saveCreds();
                } catch (e) {
                    console.error('Failed to save credentials:', e);
                }
            });


            sock.ev.on('messages.upsert', async (m) => {
                try {
                    if (m.type === 'notify') {
                        for (const msg of m.messages) {
                            const isOld = msg.messageTimestamp < (Math.floor(Date.now() / 1000) - 60);
                            if (!msg.key.fromMe && msg.message && !isOld) {
                                const from = msg.key.remoteJid;
                                const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text || msg.message?.buttonsResponseMessage?.selectedDisplayText || msg.message?.listResponseMessage?.title;
                                
                                if (!text) return; // Ignore non-text updates (presence, status, etc.)

                                console.log("\n-------------------------------------------");
                                console.log("📩 NEW MESSAGE RECEIVED!");
                                console.log("FROM:", from);
                                console.log("CONTENT:", text);
                                console.log("-------------------------------------------\n");

                                await flowController.handleMessage(businessId, from, msg);
                            }

                        }
                    }
                } catch (err) {
                    console.error(`[${businessId}] Error handling message:`, err);
                }
            });

            this.sessions.set(businessId, sock);
            return sock;
        } catch (error) {
            console.error(`[${businessId}] Init error:`, error);
            io.to(businessId).emit('whatsapp.error', 'Failed to initialize session');
            throw error;
        }
    }

    async logoutSession(businessId, io) {
        if (this.sessions.has(businessId)) {
            const sock = this.sessions.get(businessId);
            try { 
                sock.ev.removeAllListeners();
                sock.end(undefined); 
            } catch(e) {}
            this.sessions.delete(businessId);
            await new Promise(resolve => setTimeout(resolve, 1500));
        }

        try {
            const sessionPath = path.join(AUTH_BASE_DIR, businessId);
            if (fs.existsSync(sessionPath)) {
                fs.rmSync(sessionPath, { recursive: true, force: true });
            }
        } catch (e) {
            console.error('Failed to clear session path on logout:', e);
        }

        io.to(businessId).emit('whatsapp.status', 'disconnected');
    }

    getSession(businessId) {
        return this.sessions.get(businessId);
    }
}

module.exports = new WhatsAppManager();
