<template>

    <div class="w-[134px] h-[162px] p-4 rounded-lg shadow flex flex-col bg-[#292929] relative  transition-transform hover:shadow-xl hover:scale-110 hover:z-10">
       
        <!-- Imagem da rádio -->
       
            <div class="w-24 h-24 overflow-hidden">
                 <img :src="radioImg" alt="Radio Imagen" class="w-20 h-20  mx-auto" />
            </div>
       

        <!-- Nome da rádio -->

        <div class="text-center text-white flex-grow object-contain mx-auto">
            <span>{{ radioName }}</span>
        </div>

        <!-- Botões de Play e Favorito -->

        <div class="">
            <div class="flex justify-between ">

                <button class="text-blue-500 text-xl" @click="playRadio">
                    <font-awesome-icon :icon="['fas', 'play']" />
                </button>
                <button class="text-red-500 text-xl" @click="toggleFavorite">
                    <font-awesome-icon :icon="['fas', radioFavorite ? 'heart' : 'heart-broken']" />
                </button>
            </div>
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
