const express = require('express');
const User = require('./user.schema');
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
        if(decodedToken.type != 'manager'){
            return res.status(403).send({ error: { message: `Acesso negado` } })
        }
        const users = await User.find();
        return res.send({users});
    } catch (error) {
        return res.status(400).send({ error: { message: `Falha ao encontrar usuários: ${error.message}` } })
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
        const user = await User.findOne({ _id: req.params.id });
        return res.send({user});
    } catch (error) {
        return res.status(400).send({ error: { message: `Falha ao encontrar usuários: ${error.message}` } })
    }
})

router.post('/', async (req, res) => {
    const { name, cpf, address, phone, type, email, password } = req.body;


    if(!name || !cpf || !address || !phone || !type || !email || !password){
        return res.status(400).send({ error: { message: 'Campo faltante' } })
    }

    if(type != 'manager' && type != 'user'){
        return res.status(400).send({ error: { message: 'Tipo de usuário inválido' } })
    }

    try {
        if (await User.findOne({ email })) {
            return res.status(400).send({ error: { message: 'Email já cadastrado' } })
        }

        if (await User.findOne({ cpf })) {
            return res.status(400).send({ error: { message: 'CPF já cadastrado' } })
        }

        if (await User.findOne({ phone })) {
            return res.status(400).send({ error: { message: 'Telefone já cadastrado' } })
        }

        let user = await User.create(req.body);
        delete user.password

        return res.send({ user });
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
        await User.updateOne({ _id: req.params.id }, req.body);
        let user = await User.findOne({ _id: req.params.id });
        return res.send({ user });
    } catch (error) {
        return res.status(400).send({ error: { message: `Falha na atualização: ${error.message}` } })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        if(!req.headers.authorization){
            return res.status(403).send({ error: { message: `Acesso negado` } })
        }
        const token = req.headers.authorization.split(" ")[1];
        if(!token) {
            return res.status(403).send({ error: { message: `Acesso negado` } })   
        }
        await User.deleteOne({ _id: req.params.id });
        return res.send({ message: `Usuário ${req.params.id} deletado com sucesso` });
    } catch (error) {
        return res.status(400).send({ error: { message: `Falha na atualização: ${error.message}` } })
    }
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body
    try {
        let user = await User.findOne({ email }).select('+password');

        if (!user)
            return res.status(400).send({ error: { message: 'Credenciais incorretas' } })

        if (password !== user.password)
            return res.status(400).send({ error: { message: 'Credenciais incorretas' } })

        delete user.password
        const token = jwt.sign({ id: user._id, email: user.email, type: user.type }, process.env.APP_SECRET);
        return res.send({ user, token });
    } catch (error) {
        return res.status(400).send({ error: { message: `Falha no login: ${error.message}` } })
    }

})

module.exports = app => app.use('/user', router);