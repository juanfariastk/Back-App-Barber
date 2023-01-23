import multer from "multer";
import crypto from 'crypto';
import {extname, resolve } from 'path';

export default {
    storage: multer.diskStorage({
        destination: resolve(__dirname, '..', '..', 'temp', 'uploads'),
        filename:(req, arq, call) =>{
            crypto.randomBytes(16, (err, res) =>{
                if(err) return call(err)

                return call(null, res.toString('hex') + extname(arq.originalname))
            })
        } 
    })
}