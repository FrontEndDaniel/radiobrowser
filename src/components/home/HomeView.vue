<template>

    <div class="flex flex-col h-screen ">
        <div class="flex flex-1 p-4">
            <!-- Player -->

            <aside
                class="bg-blue-800 text-white flex flex-col items-center p-6 rounded-lg shadow-lg transition-all duration-300"
                :class="{ 'w-80': !isFullScreen, 'w-screen h-screen fixed top-0 left-0 z-50 flex justify-center items-center': isFullScreen }">
                <div class="w-full flex justify-between items-center"
                    :class="{ 'w-96 flex justify-between text-xs mb-8': isFullScreen }">
                    <h1 class="text-2xl font-bold tracking-wide">Web Rádio</h1>
                    <button @click="toggleFullScreen">
                        <font-awesome-icon :icon="['fas', isFullScreen ? 'compress' : 'expand']"
                            class="text-white text-xl" />
                    </button>
                </div>

                <!-- Tocando Agora -->
                <h2 class="text-lg font-bold pt-5">TOCANDO AGORA</h2>
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR518a2fB0z8XrUdnZmMwmovhXfR8c_y8uUWQ&s"
                    alt="Radio Logo" class="w-80 h-80 object-cover rounded-lg my-4" />
                <h3 class="text-lg font-semibold">Jovem Pan FM</h3>

                <!-- Barra de progresso -->
                <div class="w-52 flex justify-between text-xs mt-2 opacity-80"
                    :class="{ 'w-96 flex justify-between text-xs mt-2 opacity-80': isFullScreen }">
                    <span> {{ formatarTempo(tempoAtual) }} </span>
                    <span> --:-- </span>
                </div>

                <div :class="{ 'absolute bottom-10 w-full': isFullScreen }">
                    <div class="flex items-center justify-center">
                        <input type="range" min="0" :max="maximoProgresso" v-model="tempoAtual"
                            class="barra-progresso w-48" :class="{ 'absolute bottom-36 w-96': isFullScreen }"
                            disabled />
                    </div>

                    <audio ref="audio" @loadedmetadata="iniciarContagem">
                        <source src="https://stm16.xcast.com.br:9928/stream" type="audio/mp3" />
                    </audio>

                    <!-- Controles -->
                    <div class="flex items-center justify-center gap-6 mt-6"
                        :class="{ 'absolute bottom-10 w-full': isFullScreen }">
                        <font-awesome-icon :icon="['fas', 'volume-up']" class="text-xl cursor-pointer" />
                        <button @click="togglePlay">
                            <font-awesome-icon :icon="tocando ? ['fas', 'pause'] : ['fas', 'play']" class="text-3xl" />
                        </button>
                        <button class="text-red-500 text-xl" @click="toggleFavorite(this.radio)">
                            <font-awesome-icon :icon="['fas', this.radio.favorite ? 'heart' : 'heart-broken']" />
                        </button>
                    </div>
                </div>
            </aside>

            <!-- Área principal -->
            <main class="flex-1 p-4 ml-4 bg-gray-700 rounded-lg ">
                <div class="flex justify-end ">
                    <button class="bg-orange-400 font-bold rounded-2xl w-20 " @click="userLogin()">Entrar</button>
                </div>

                <div class="w-1/2 mx-auto">
                    <div class="w-1/2 mx-auto">
                        <input class=" rounded-2xl p-4 w-80 h-8" type="text" placeholder="Procurar Rádio"
                            @keyup.enter="searchRadio()">
                    </div>
                </div>

                <!-- Botões de filtro -->
                <div>
                    <button class="p-2 border rounded-2xl m-3 font-bold"
                        :class="{ 'bg-white text-black': !showFavoritesOnly, 'text-white': showFavoritesOnly }"
                        @click="showAll">
                        Todos
                    </button>

                    <button class="p-2 border rounded-2xl m-3 font-bold"
                        :class="{ 'bg-white text-black': showFavoritesOnly, 'text-white': !showFavoritesOnly }"
                        @click="showFavorites">
                        Favoritas
                    </button>
                </div>

                <!-- Lista de rádios -->
                <div class="grid grid-cols-8 gap-4 mt-4 ">
                    <div v-for="radio in filteredRadios" :key="radio.id"
                        class="bg-white p-4 rounded-lg shadow items-center">
                        <img :src="radio.image" :alt="radio.name" class="w-20 h-20 object-cover mb-2 mx-auto" />
                        <div class="flex justify-between items-center">
                            <button class="text-blue-500 text-xl">
                                <font-awesome-icon :icon="['fas', 'play']" />
                            </button>
                            <button class="text-red-500 text-xl" @click="toggleFavorite(radio)">
                                <font-awesome-icon :icon="['fas', radio.favorite ? 'heart' : 'heart-broken']" />
                            </button>
                        </div>
                    </div>
                </div>

            </main>

        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            showFavoritesOnly: false,
            isFullScreen: false,
            radio: [],
            tocando: false,
            tempoAtual: 0,
            maximoProgresso: 300, // 5 minutos simulados
            radios: [
                { id: 1, name: "Radio 1", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR518a2fB0z8XrUdnZmMwmovhXfR8c_y8uUWQ&s", favorite: false },
                { id: 2, name: "Radio 2", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR518a2fB0z8XrUdnZmMwmovhXfR8c_y8uUWQ&s", favorite: true },
                { id: 3, name: "Radio 3", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR518a2fB0z8XrUdnZmMwmovhXfR8c_y8uUWQ&s", favorite: false },
                { id: 4, name: "Radio 4", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR518a2fB0z8XrUdnZmMwmovhXfR8c_y8uUWQ&s", favorite: true }
            ]
        };
    },
    computed: {
        filteredRadios() {
            return this.showFavoritesOnly
                ? this.radios.filter(radio => radio.favorite)
                : this.radios;
        }
    },
    methods: {
        showAll() {
            this.showFavoritesOnly = false;
        },
        showFavorites() {
            this.showFavoritesOnly = true;
        },
        toggleFavorite(radio) {
            this.radio = radio
            radio.favorite = !radio.favorite;
        },
        toggleFullScreen() {
            this.isFullScreen = !this.isFullScreen;
        },
        userLogin() {
            console.log('logar')
        },
        searchRadio() {
            console.log("procurando")
        },
        async togglePlay() {
            const audio = this.$refs.audio;
            if (this.tocando) {
                audio.pause();
            } else {
                try {
                    await audio.play();
                    this.iniciarContagem();
                } catch (error) {
                    console.error("Erro ao tentar reproduzir o áudio:", error);
                }
            }
            this.tocando = !this.tocando;
        },
        iniciarContagem() {
            setInterval(() => {
                if (this.tocando) {
                    this.tempoAtual++;
                    if (this.tempoAtual >= this.maximoProgresso) {
                        this.tempoAtual = 0; // Reinicia após 5 minutos
                    }
                }
            }, 1000);
        },
        formatarTempo(segundos) {
            const minutos = Math.floor(segundos / 60);
            const seg = Math.floor(segundos % 60);
            return `${minutos}:${seg < 10 ? '0' : ''}${seg}`;
        }
    }
}

</script>

<style>
body {
    background-color: #504c4cb4;
}
</style>
