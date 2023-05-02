<template>
    OpenAI-SB API Key
    <div style="margin-bottom: 5px;"></div>
    <t-input size="large" placeholder="OpenAI-SB API Key" style="max-width: 99%;" v-model="apikey" />
    <div style="opacity: 0.5; margin-bottom: 10px;">OpenAI-SB API Key将保存至本地LocalStorage。</div>
    已充值金额 (CNY=USD)
    <div style="margin-bottom: 5px;"></div>
    <t-input size="large" placeholder="已充值金额 (CNY=USD)" style="max-width: 99%; margin-bottom: 10px;" v-model="chargedMoney" />
    <t-button @click="save()">保存</t-button>
    <div style="opacity: 0.5; margin-top: 20px;">附：因OpenAI-SB API的CORS政策影响，本项目默认使用sbapi.crooi.io作为反代服务器，此服务器仅作转发使用，不会记录任何用户信息。<br/>若担心OpenAI-SB API Key或其他信息泄漏，请至GitHub Fork本项目源码后自行设置您信任的反代服务器并部署。</div>
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