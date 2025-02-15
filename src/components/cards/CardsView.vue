<template>
    <div class="w-[144px] h-[182px] p-4 rounded-lg shadow flex flex-col bg-[#292929]">
        <!-- Imagem da rádio -->
        <img :src="radioImg" alt="Radio Imagen" class="w-20 h-20 object-contain mb-2 mx-auto" />

        <!-- Nome da rádio -->
        <div class="text-center text-white flex-grow">
            <span>{{ radioName }}</span>
        </div>

        <!-- Botões de Play e Favorito -->
        <div class="flex justify-between items-center mt-auto">
            <button class="text-blue-500 text-xl" @click="playRadio">
                <font-awesome-icon :icon="['fas', 'play']" />
            </button>
            <button class="text-red-500 text-xl" @click="toggleFavorite">
                <font-awesome-icon :icon="['fas', radioFavorite ? 'heart' : 'heart-broken']" />
            </button>
        </div>
    </div>
</template>

<script>
// Definição do componente com tipagem das props
export default {
    props: {
        radioImg: {
            type: String,
            required: true
        },
        radioName: {
            type: String,
            required: true
        },
        radioFavorite: {
            type: Boolean,
            required: true
        }
    },
    methods: {
        toggleFavorite() {
            // Emite o evento para o componente pai
            this.$emit('toggle-favorite');
        },
        playRadio() {
            // Emite o evento para iniciar a reprodução da rádio
            this.$emit('play-radio', { url: this.radioImg, name: this.radioName });
        }
    }
};
</script>
