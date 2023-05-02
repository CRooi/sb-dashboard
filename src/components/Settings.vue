<template>
    API Key
    <div style="margin-bottom: 5px;"></div>
    <t-input size="large" placeholder="API Key" style="max-width: 99%;" v-model="apikey" />
    <div style="opacity: 0.5; margin-bottom: 10px;">API Key将保存至本地LocalStorage。</div>
    已充值金额 (CNY=USD)
    <div style="margin-bottom: 5px;"></div>
    <t-input size="large" placeholder="已充值金额 (CNY=USD)" style="max-width: 99%; margin-bottom: 10px;" v-model="chargedMoney" />
    <t-button @click="save()">保存</t-button>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue'
import ls from '../localStorage'
import { MessagePlugin } from 'tdesign-vue-next'

let apikey: Ref<string> = ref(ls.get('apikey') || '')
let chargedMoney: Ref<string> = ref(ls.get('chargedMoney') || '')

let save = () => {
    ls.set('apikey', apikey.value)
    ls.set('chargedMoney', chargedMoney.value)
    MessagePlugin.success('保存成功。')
}
</script>