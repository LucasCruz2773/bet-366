const express = require('express');
const UserBet = require('./userBet.schema');
const Wallet = require('../wallet/wallet.schema');
const Bet = require('../bet/bet.schema');
const Option = require('../bet/option.schema');
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
        if(decodedToken.type != 'user'){
            return res.status(403).send({ error: { message: `Acesso negado` } })
        }
        let bets = await UserBet.find({id_user: decodedToken.id});
        let formatedBets = [];
        await Promise.all(bets.map(async (bet) => {
            let opt = await Option.findOne({_id: bet.id_option});
            let bt = await Bet.findOne({_id: opt.id_bet});
            formatedBets.push({
                value: bet.value,
                title: bt.title,
                option: opt.name
            })
        }))
        return res.send({ bets: formatedBets });
    } catch (error) {
        return res.status(400).send({ error: { message: `Falha na consulta: ${error.message}` } })
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

    if(decodedToken.type != 'user'){
        return res.status(403).send({ error: { message: `Acesso negado` } })
    }
    try {
        const { id_option, value } = req.body;
        if(!id_option || !value){
            return res.status(400).send({ error: { message: `Falha no cadastro: Campos faltantes` } })    
        }
        let wallet = await Wallet.findOne({ id_user: decodedToken.id });
        if(value < 0){
            return res.status(400).send({ error: { message: `Valor inválido` } });
        }
        if(value > wallet.value ){
            return res.status(400).send({ error: { message: `Saldo insuficiente para aposta` } });
        }
        let opt = await Option.findOne({_id: id_option});
        if(opt == null){
            return res.status(400).send({ error: { message: `Opção inválida` } });
        }
        let bt = await Bet.findOne({_id: opt.id_bet});
        if(bt.status != 'open'){
            return res.status(400).send({ error: { message: `Aposta indisponível` } });
        }
        wallet.value = wallet.value - value;
        await Wallet.updateOne({ id_user: decodedToken.id }, wallet);
        let bet = await UserBet.create({ id_option: id_option, id_user: decodedToken.id, value: value });
        return res.send({ bet: bet });
    } catch (error) {
        return res.status(400).send({ error: { message: `Falha no cadastro: ${error.message}` } })
    }
})

module.exports = app => app.use('/user-bet', router);