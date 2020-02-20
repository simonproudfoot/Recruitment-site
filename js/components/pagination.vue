<template>
    <div class="row justify-content-md-center border">
        <div v-bind:class="step == 1 ? 'd-none' : 'col-xs-6'">
            <button class="btn-block" @click.prevent="goPrev()">< Previous</button>
        </div>
        <div v-bind:class="step == 6 ? 'd-none' : 'col-xs-6'">
            <button class="btn-block" @click.prevent="$emit('next')">Next ></button>
        </div>
    </div>
</template>
<script>
export default {
    props: ['step'],
    methods: {
        goPrev: function() {
			this.$emit('prev');		
        },
        goNext: function() {
            this.$emit('next');
        }
    }
}
</script>

