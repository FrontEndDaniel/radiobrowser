<template>
    <div class="flex flex-col h-screen bg-black overflow-hidden">
        <div class="flex flex-1 p-4">
            <aside
                class="bg-[#A62427] text-white flex flex-col items-center p-6 rounded-lg shadow-lg transition-all duration-300 justify-center h-[890px]"
                :class="{ 'w-80': !isFullScreen, 'w-screen h-screen fixed top-0 left-0 z-50 flex justify-center items-center': isFullScreen }">
                <div class="mb-60">
                    <button @click="toggleFullScreen">
                        <font-awesome-icon :icon="['fas', isFullScreen ? 'compress' : 'expand']"
                            class="text-white text-xl" />
                    </button>
                </div>
                <div class="w-full flex justify-center  items-center">
                    <h1 class="text-4xl font-bold tracking-wide">Web Rádio</h1>
                </div>

                <h2 class="text-lg font-bold pt-5">TOCANDO AGORA</h2>
                <img :src="radio.favicon ? radio.favicon : defaultFavicon" alt="Radio Logo"
                    class="w-80 h-auto object-cover rounded-lg my-4" />
                <h3 class="text-lg font-semibold"> {{ radio.name }} </h3>

                <audio ref="audioPlayer" controls autoplay class="bg-slate-100 rounded-2xl">
                    <source :src="currentUrl" type="audio/mpeg">
                </audio>
            </aside>
            <div class="flex-1  p-4 ml-4 bg-[#181818bd] rounded-lg flex flex-col justify-between ">
                <div>
                    <div class="flex justify-end">
                        <button class="bg-gradient-to-r from-[#C70300] to-[#f96401] font-bold rounded-2xl w-20"
                            @click="handleAuthAction">
                            {{ user ? "Sair" : "Entrar" }}
                        </button>
                    </div>

                    <div class="w-full flex justify-center items-center mt-4">
                        <input class="rounded-2xl p-4 w-80 h-8" type="text" placeholder="Procurar Rádio"
                            v-model="radioSearch" @keyup.enter="searchRadio">
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
                </div>
                <main class="flex-1 p-4 ml-4 bg-[#181818bd] rounded-lg flex flex-col items-center justify-start">
                    <div  v-if="loading" class="flex justify-center items-center min-h-screen">
                        <div className="w-24 h-24 border-4 border-t-transparent border-blue-500 rounded-full animate-spin "></div>
                    </div>
                   

                    <div>
                        <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-8 gap-4  flex-grow justify-start">
                            <div v-for="radio in paginatedRadios" :key="radio.id">
                                <CardsView :radioImg="radio.favicon"
                                    :radioName="radio.name.length > 15 ? radio.name.substring(0, 15) + '...' : radio.name"
                                    :radioFavorite="radioFavorite[radio.changeuuid]"
                                    @toggle-favorite="toggleFavorite(radio)" @play-radio="radioPlay(radio)" />
                            </div>
                        </div>


                    </div>
                </main>
                <div class="w-full flex justify-center items-center mt-4">
                    <button class="p-2 bg-slate-950 text-white rounded-lg m-3 font-bold" @click="prevPage"
                        :disabled="currentPage === 1">Anterior</button>
                    <span class="text-white font-bold">Página {{ currentPage }} de {{ totalPages }}</span>
                    <button class="p-2 bg-slate-950 text-white rounded-lg m-3 font-bold" @click="nextPage"
                        :disabled="currentPage === totalPages">Próxima</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import CardsView from '../cards/CardsView.vue';
import { defineComponent } from 'vue';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, getDocs, deleteDoc } from "firebase/firestore";

export default defineComponent({
    components: { CardsView },
    data() {
        return {
            radioSearch: "",
            radioFavorite: {},
            showFavoritesOnly: false,
            isFullScreen: false,
            loading: false,
            radios: [],
            radio: {},
            currentUrl: "",
            currentPage: 1,
            radiosPerPage: 24,
            user: null,
            defaultFavicon: 'https://cdn.textstudio.com/output/sample/normal/3/7/6/6/radio-logo-860-6673.png',
            db: getFirestore()
        };
    },
    computed: {
        filteredRadios() {
            return this.showFavoritesOnly
                ? this.radios.filter(radio => this.radioFavorite[radio.changeuuid]) // Filtra pelos favoritos
                : this.radios;
        },
        totalPages() {
            return Math.ceil(this.filteredRadios.length / this.radiosPerPage);
        },
        paginatedRadios() {
            let start = (this.currentPage - 1) * this.radiosPerPage;
            let end = start + this.radiosPerPage;
            return this.filteredRadios.slice(start, end);
        }
    },
    methods: {
        async searchRadio() {
            try {
                this.loading = true
                let url = this.radioSearch
                    ? `https://de1.api.radio-browser.info/json/stations/search?name=${this.radioSearch}`
                    : 'http://de1.api.radio-browser.info/json/stations/bycountry/brazil';

                let resp = await axios.get(url);
                this.radios = resp.data.map(radio => ({
                    ...radio,
                    favicon: radio.favicon || this.defaultFavicon
                }));

                this. loading = false
            } catch (error) {
                console.error("Erro ao carregar rádios:", error);
            }
        },
        async toggleFavorite(radio) {
            if (!this.user) return alert("Faça login para salvar favoritos!");

            const userRef = collection(this.db, "users", this.user.uid, "favorites");
            const favoriteRef = doc(userRef, radio.changeuuid);

            if (this.radioFavorite[radio.changeuuid]) {
                await deleteDoc(favoriteRef); // Remove do Firebase
                delete this.radioFavorite[radio.changeuuid]; // Remove do estado local usando o operador delete
            } else {
                await setDoc(favoriteRef, {
                    uuid: radio.changeuuid,
                    name: radio.name,
                    url: radio.url,
                    favicon: radio.favicon
                });
                this.radioFavorite[radio.changeuuid] = true; // Atribuição direta
            }
        }
        ,
        async loadFavorites() {
            if (!this.user) return;

            const userFavoritesRef = collection(this.db, "users", this.user.uid, "favorites");
            const querySnapshot = await getDocs(userFavoritesRef);

            this.radioFavorite = {}; // Resetar o estado antes de carregar

            querySnapshot.docs.forEach(doc => {
                const favoriteData = doc.data();
                this.radioFavorite[favoriteData.uuid] = true; // Armazena baseado no UUID
            });
        },
        showAll() {
            this.showFavoritesOnly = false;
            this.currentPage = 1;
        },
        showFavorites() {
            this.showFavoritesOnly = true;
            this.currentPage = 1;
        },
        toggleFullScreen() {
            this.isFullScreen = !this.isFullScreen;
        },
        nextPage() {
            if (this.currentPage < this.totalPages) this.currentPage++;
        },
        prevPage() {
            if (this.currentPage > 1) this.currentPage--;
        },
        handleAuthAction() {
            if (this.user) {
                this.logout();
            } else {
                this.$router.push('/register');
            }
        },
        async logout() {
            const auth = getAuth();
            await signOut(auth);
            this.user = null;
            this.radioFavorite = {}; // Limpa os favoritos ao sair
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
        updateRadiosPerPage() {
            const width = window.innerWidth;

            if (width < 640) {
                this.radiosPerPage = 3; // Para telas pequenas (exemplo: celulares)
            } else if (width < 1024) {
                this.radiosPerPage = 6; // Para telas médias (exemplo: tablets)
            } else {
                this.radiosPerPage = 24; // Para telas maiores (exemplo: desktops)
            }

            this.currentPage = 1; // Reinicia para evitar inconsistências
        }



    },
    created() {
        this.searchRadio();
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            this.user = user;
            if (user) this.loadFavorites();
        });
        this.updateRadiosPerPage(); // Define o número de itens ao inicia
        window.addEventListener('resize', this.updateRadiosPerPage); // Escuta mudanças na tela
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.updateRadiosPerPage); // Remove o listener ao destruir o componente
    }
});
</script>
