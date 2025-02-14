<template>
    <div class="h-screen flex items-center justify-center bg-black">
        <div class="flex flex-col items-center justify-center space-y-4">
            <!-- Logar na conta -->
            <div class="flex flex-col items-center justify-center space-y-4" v-if="!register">
                <h1 class="text-white text-center text-xl font-semibold">
                    A sua trilha sonora perfeita para todos os momentos.
                </h1>
                <input v-model="email" class="text-black w-96 h-8 rounded-lg p-2" type="email" placeholder="E-mail">
                <input v-model="password" class="text-black w-96 h-8 rounded-lg p-2" type="password" placeholder="Digite sua senha">
                <button class="text-white w-96 h-8 rounded-lg p-2 text-end" @click="resetPassword">Esqueceu a senha?</button>
                <div class="flex">
                    <button class="bg-gradient-to-r from-[#C70300] to-[#f96401] font-bold rounded-2xl w-32 h-8"
                        @click="login">Entrar</button>
                </div>
                <div class="flex">
                    <button class="font-bold rounded-2xl w-32 h-8 text-white" @click="toRegister">Criar conta</button>
                </div>
            </div>

            <!-- Criar conta -->
            <div class="flex flex-col items-center justify-center space-y-4" v-if="register">
                <h1 class="text-white text-center text-xl font-semibold">
                    Cadastre-se grátis
                </h1>
                <input v-model="email" class="text-black w-96 h-8 rounded-lg p-2" type="email" placeholder="E-mail">
                <input v-model="password" class="text-black w-96 h-8 rounded-lg p-2" type="password" placeholder="Digite sua senha">
                <input v-model="confirmPassword" class="text-black w-96 h-8 rounded-lg p-2" type="password" placeholder="Confirme sua senha">
                <div class="flex">
                    <button class="bg-gradient-to-r from-[#C70300] to-[#f96401] font-bold rounded-2xl w-32 h-8"
                        @click="registerUser">Criar conta</button>
                </div>
                <div class="flex">
                    <button class="font-bold rounded-2xl w-32 h-8 text-white" @click="toLogin">Já tem uma conta? Faça login</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import firebaseApp from '@/firebaseConfig.js'; // Importa o Firebase configurado

export default defineComponent({
    data() {
        return {
            register: false,
            email: '',
            password: '',
            confirmPassword: ''
        };
    },
    methods: {
        toRegister() {
            this.register = true;
        },
        toLogin() {
            this.register = false;
        },
        async registerUser() {
            if (this.password !== this.confirmPassword) {
                alert("As senhas não coincidem!");
                return;
            }

            try {
                const auth = getAuth(firebaseApp);
                const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
                console.log("Conta criada:", userCredential.user);
                alert("Conta criada com sucesso!");
                this.toLogin();
            } catch (error) {
                alert("Erro ao criar conta: " + error.message);
            }
        },
        async login() {
            try {
                const auth = getAuth(firebaseApp);
                const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
                console.log("Usuário logado:", userCredential.user);
                alert("Login realizado com sucesso!");
                this.$router.push('/'); // Redireciona para a home após login
            } catch (error) {
                alert("Erro ao fazer login: " + error.message);
            }
        },
        async resetPassword() {
            if (!this.email) {
                alert("Digite seu e-mail para redefinir a senha!");
                return;
            }

            try {
                const auth = getAuth(firebaseApp);
                await sendPasswordResetEmail(auth, this.email);
                alert("E-mail de redefinição de senha enviado!");
            } catch (error) {
                alert("Erro ao redefinir senha: " + error.message);
            }
        }
    }
});
</script>
