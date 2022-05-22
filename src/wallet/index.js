const express = require('express');
const Wallet = require('./wallet.schema');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        if(!req.headers.authorization){
            return res.status(403).send({ error: { message: `Acesso negado` } })
        }
        const token = req.headers.authorization.split(" ")[1];
        if(!token) {
            return res.status(403).send({ error: { message: `Acesso negado` } })   
        }
        const decodedToken = await promisify(jwt.verify)(token, process.env.APP_SECRET);
        let wallet = await Wallet.findOne({ id_user: decodedToken.id });
        return res.send({ wallet });
    } catch (error) {
        return res.status(400).send({ error: { message: `Falha na atualização: ${error.message}` } })
    }
})

router.post('/', async (req, res) => {
    if(!req.headers.authorization){
        return res.status(403).send({ error: { message: `Acesso negado` } })
    }
    const token = req.headers.authorization.split(" ")[1];
    if(!token) {
        return res.status(403).send({ error: { message: `Acesso negado` } })   
    }
    const decodedToken = await promisify(jwt.verify)(token, process.env.APP_SECRET);
    
    try {
        let walletUsed = await Wallet.findOne({ id_user: decodedToken.id });
        if(walletUsed == null ){
            let wallet = await Wallet.create({ id_user: decodedToken.id, value: 0 });
            return res.send({ wallet });
        } else {
            return res.status(400).send({ error: { message: `Falha no cadastro: Usuário já possui uma carteira na plataforma` } })
        }
    } catch (error) {
        return res.status(400).send({ error: { message: `Falha no cadastro: ${error.message}` } })
    }
})

router.put('/transaction', async (req, res) => {
    try {
        if(!req.headers.authorization){
            return res.status(403).send({ error: { message: `Acesso negado` } })
        }
        const token = req.headers.authorization.split(" ")[1];
        if(!token) {
            return res.status(403).send({ error: { message: `Acesso negado` } })   
        }
        if(!req.body.value){
            return res.status(400).send({ error: { message: `É necessário enviar um valor para transação` } });
        }
        const decodedToken = await promisify(jwt.verify)(token, process.env.APP_SECRET);
        let wallet = await Wallet.findOne({ id_user: decodedToken.id });
        wallet.value = wallet.value + req.body.value;
        await Wallet.updateOne({ id_user: decodedToken.id }, wallet);
        return res.send({ wallet });
    } catch (error) {
        return res.status(400).send({ error: { message: `Falha na atualização: ${error.message}` } })
    }
})

router.delete('/', async (req, res) => {
    try {
        if(!req.headers.authorization){
            return res.status(403).send({ error: { message: `Acesso negado` } })
        }
        const token = req.headers.authorization.split(" ")[1];
        if(!token) {
            return res.status(403).send({ error: { message: `Acesso negado` } })   
        }
        const decodedToken = await promisify(jwt.verify)(token, process.env.APP_SECRET);
        await Wallet.deleteOne({ id_user: decodedToken.id });
        
        return res.send({ message: `Carteira deletada com sucesso` });
    } catch (error) {
        return res.status(400).send({ error: { message: `Falha na atualização: ${error.message}` } })
    }
})

module.exports = app => app.use('/wallet', router);