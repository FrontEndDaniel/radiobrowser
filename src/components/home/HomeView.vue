<template>
    <div class="flex flex-col h-screen bg-black">
        <div class="flex flex-1 p-4">
            <aside
                class="bg-[#A62427] text-white flex flex-col items-center p-6 rounded-lg shadow-lg transition-all duration-300 justify-center"
                :class="{ 'w-80': !isFullScreen, 'w-screen h-screen fixed top-0 left-0 z-50 flex justify-center items-center': isFullScreen }">
                
                <div class="w-full flex justify-between items-center"
                    :class="{ 'w-96 flex justify-between text-xs mb-8': isFullScreen }">
                    <h1 class="text-2xl font-bold tracking-wide">Web Rádio</h1>
                    <button @click="toggleFullScreen">
                        <font-awesome-icon :icon="['fas', isFullScreen ? 'compress' : 'expand']"
                            class="text-white text-xl" />
                    </button>
                </div>

                <h2 class="text-lg font-bold pt-5">TOCANDO AGORA</h2>
                <img :src="radio.favicon ? radio.favicon : 'https://fmdombosco.com/wp-content/uploads/2023/11/LEADING-PAGE-DB-MOD-1-PSD-V2.png'" alt="Radio Logo"
                    class="w-80 h-auto object-cover rounded-lg my-4" />
                <h3 class="text-lg font-semibold"> {{ radio.name }} </h3>

                <audio ref="audioPlayer" controls autoplay class="bg-slate-100 rounded-2xl">
                    <source :src="currentUrl" type="audio/mpeg">
                </audio>
            </aside>

            <main class="flex-1 p-4 ml-4 bg-[#181818bd] rounded-lg flex flex-col justify-between">
                <div class="flex justify-end">
                    <button class="bg-gradient-to-r from-[#C70300] to-[#f96401] font-bold rounded-2xl w-20" @click="userLogin()">Entrar</button>
                </div>

                <div class="w-full flex justify-center items-center mt-4">
                    <input class="rounded-2xl p-4 w-80 h-8" type="text" placeholder="Procurar Rádio"
                        v-model="radioSearch" @keyup.enter="searchRadio()">
                </div>

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

                <div class="grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mt-4 flex-grow">
                    <div v-for="radio in paginatedRadios" :key="radio.id">
                        <CardsView :radioImg="radio.favicon"
                            :radioName="radio.name.length > 15 ? radio.name.substring(0, 15) + '...' : radio.name"
                            :radioFavorite="radioFavorite[radio.id]" @toggle-favorite="toggleFavorite(radio.id)"
                            @play-radio="radioPlay(radio)" />
                    </div>
                </div>

                <div class="w-full flex justify-center items-center mt-4">
                    <button class="p-2 bg-slate-950 text-white rounded-lg m-3 font-bold" @click="prevPage"
                        :disabled="currentPage === 1">Previous</button>
                    <span class="text-white font-bold">Página {{ currentPage }} de {{ totalPages }}</span>
                    <button class="p-2 bg-slate-950 text-white rounded-lg m-3 font-bold" @click="nextPage"
                        :disabled="currentPage === totalPages">Next</button>
                </div>
            </main>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import CardsView from '../cards/CardsView.vue';
import { defineComponent } from 'vue';

export default defineComponent({
    components: { CardsView },
    data() {
        return {
            radioSearch: "",
            radioFavorite: {},
            showFavoritesOnly: false,
            isFullScreen: false,
            radios: [],
            radio: {},
            currentUrl: "",
            currentPage: 1,
            radiosPerPage: 24,
            defaultFavicon: 'https://cdn.textstudio.com/output/sample/normal/3/7/6/6/radio-logo-860-6673.png' // Aqui você define a URL da imagem padrão
        };
    },
    computed: {
        totalPages() {
            return Math.ceil(this.radios.length / this.radiosPerPage);
        },
        paginatedRadios() {
            let start = (this.currentPage - 1) * this.radiosPerPage;
            let end = start + this.radiosPerPage;
            return this.radios.slice(start, end);
        },
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
        toggleFavorite(radioId) {
            this.$set(this.radioFavorite, radioId, !this.radioFavorite[radioId]);
        },
        toggleFullScreen() {
            this.isFullScreen = !this.isFullScreen;
        },
        userLogin() {
            console.log('logar');
        },
        async searchRadio() {
            try {
                if (this.radioSearch === "") {
                    let resp = await axios.get('http://de1.api.radio-browser.info/json/stations/bycountry/brazil');
                    console.log(resp.data)
                    this.radios = resp.data.map(radio => {
                        // Verifica se o campo favicon está vazio
                        if (!radio.favicon) {
                            radio.favicon = this.defaultFavicon;
                        }
                        return radio;
                    });
                } else {
                    let resp = await axios.get(`https://de1.api.radio-browser.info/json/stations/search?name=${this.radioSearch}`);
                    this.radios = resp.data.map(radio => {
                        // Verifica se o campo favicon está vazio
                        if (!radio.favicon) {
                            radio.favicon = this.defaultFavicon;
                        }
                        return radio;
                    });
                }
            } catch (error) {
                console.error("Erro ao exibir as rádios", error);
            }
        },
        radioPlay(selectedRadio) {
            this.radio = selectedRadio;
            this.currentUrl = selectedRadio.url;
            this.$nextTick(() => {
                if (this.$refs.audioPlayer) {
                    this.$refs.audioPlayer.load();
                    this.$refs.audioPlayer.play();
                }
            });
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
        }
    },
    created() {
        this.searchRadio();
    }
});
</script>
