const express = require('express');
const Bet = require('./bet.schema');
const Option = require('./option.schema');
const Wallet = require('../wallet/wallet.schema');
const UserBet = require('../userBet/userBet.schema');
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
        let bets = await Bet.find();
        await Promise.all(bets.map(async (bet) => {
            let options = await Option.find({id_bet: bet._id});
            if(bet.status == 'open'){
                options.map((option ) => {
                    option.correct = null
                })
            }
            bet.options = options;
        }));
        return res.send({ bets });
    } catch (error) {
        return res.status(400).send({ error: { message: `Falha na consulta: ${error.message}` } })
    }
})

router.get('/:id', async (req, res) => {
    try {
        if(!req.headers.authorization){
            return res.status(403).send({ error: { message: `Acesso negado` } })
        }
        const token = req.headers.authorization.split(" ")[1];
        if(!token) {
            return res.status(403).send({ error: { message: `Acesso negado` } })   
        }
        let bet = await Bet.findOne({_id: req.params.id});
        let options = await Option.find({id_bet: bet._id});
        if(bet.status == 'open'){
            options.map((option ) => {
                option.correct = null
            })
        }
        bet.options = options;
        return res.send({ bet });
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

    if(decodedToken.type != 'manager'){
        return res.status(403).send({ error: { message: `Acesso negado` } })
    }
    try {
        const { title, options } = req.body;
        let bet = await Bet.create({ title: title, id_user: decodedToken.id, status: 'open', finalizedAt: null });
        let optionsCreated = [];
        if(!title || !options){
            return res.status(400).send({ error: { message: `Falha no cadastro: Campos faltantes` } })    
        }
        await Promise.all(options.map(async (option) => {
            let opt = await Option.create({ id_bet: bet._id, name: option.name, odd: option.odd, correct: option.correct });
            optionsCreated.push(opt);
        }));
        return res.send({ bet: bet, options: optionsCreated });
    } catch (error) {
        return res.status(400).send({ error: { message: `Falha no cadastro: ${error.message}` } })
    }
})

router.put('/:id', async (req, res) => {
    try {
        if(!req.headers.authorization){
            return res.status(403).send({ error: { message: `Acesso negado` } })
        }
        const token = req.headers.authorization.split(" ")[1];
        if(!token) {
            return res.status(403).send({ error: { message: `Acesso negado` } })   
        }
        const decodedToken = await promisify(jwt.verify)(token, process.env.APP_SECRET);
        if(decodedToken.type != 'manager'){
            return res.status(403).send({ error: { message: `Acesso negado` } })
        }
        await Bet.updateOne({ _id: req.params.id }, {status: req.body.status, finalizedAt: new Date()});
        if(req.body.status == 'closed'){
            let optCorrect = await Option.findOne({id_bet: req.params.id, correct: true});
            let userWins = await UserBet.find({id_option: optCorrect._id});
            Promise.all(userWins.map(async (user) => {
                let wallet = await Wallet.findOne({id_user: user.id_user});
                let newValueWallet = wallet.value + (user.value*optCorrect.odd);
                await Wallet.updateOne({id_user: user.id_user}, {value: newValueWallet})
            }))
        }
        const bet = await Bet.findOne({ _id: req.params.id });
        return res.send({ bet });
    } catch (error) {
        return res.status(400).send({ error: { message: `Falha na atualização: ${error.message}` } })
    }
})

module.exports = app => app.use('/bet', router);