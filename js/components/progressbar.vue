<template>
    <progress v-bind:value="step" max="8"></progress>
</template>

<script>
export default {
    props:['step']
	
}
</script>

