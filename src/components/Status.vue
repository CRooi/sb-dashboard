<template>
    <div v-if="apikey == ''">
        您还未配置OpenAI-SB API Key。
    </div>
    <div v-if="apikey != ''">
        <div style="font-weight: bold; font-size: 24px; margin-bottom: 10px;">概览<t-loading v-if="isLoading" style="position: relative; left: 2px; top: -2px; font-size: 24px;" /></div>
        <t-skeleton animation="gradient" v-if="isLoading" />
        <t-base-table hover stripe bordered row-key="index" :data="data" :columns="columns" :show-header="false"
            style="max-width: 32%; min-width: 390px; margin-bottom: 10px;" v-if="!isLoading" />
        <div style="font-weight: bold; font-size: 24px; margin-bottom: 10px;">用量<t-loading v-if="isLoading" style="position: relative; left: 2px; top: -2px; font-size: 24px;" /></div>
        <t-skeleton animation="gradient" v-if="isLoading" />
        <t-space align="center" direction="vertical" size="small" class="t-progress-demo-inner" v-if="!isLoading">
            <div class="t-progress-demo-margin">余额</div>
            <t-progress theme="circle" :label="Number(balancePercentage).toFixed(0) + '%'" :percentage="balancePercentage" :size="'medium'" :status="balancePercentageStatus" />
        </t-space>
    </div>
</template>

<script setup lang="ts">
import { ref, Ref, computed } from 'vue'
import ls from '../localStorage'
import axios from 'axios'
import { MessagePlugin } from 'tdesign-vue-next'

let isLoading: Ref<boolean> = ref(true)
let apikey: Ref<string> = ref(ls.get('apikey') || '')
let chargedMoney: Ref<string> = ref(ls.get('chargedMoney') || '')
let moneyBalance: Ref<string> = ref('载入中')
let balancePercentage = computed(() => {
    if(chargedMoney.value.includes('.')) {
        return Number(moneyBalance.value) / Number(chargedMoney.value) * 100
    }else {
        return 0
    }
})
let balancePercentageStatus = computed(() => {
    if(Number(balancePercentage.value) >= 0 && Number(balancePercentage.value) <= 10) {
        return 'error'
    }else if(Number(balancePercentage.value) > 10 && Number(balancePercentage.value) <= 30) {
        return 'warning'
    }else if(Number(balancePercentage.value) > 30 && Number(balancePercentage.value) <= 100) {
        return 'success'
    }
})

let data = ref([
    {
        key: '积分余额',
        value: '载入中'
    },
    {
        key: '已充值CNY(=USD)',
        value: '载入中'
    },
    {
        key: 'USD(=CNY)余额',
        value: '载入中'
    },
    {
        key: '累计调用次数',
        value: '载入中'
    },
    {
        key: '累计消耗Tokens',
        value: '载入中'
    },
    {
        key: 'GPT4开关',
        value: '载入中'
    }
])

let columns = ref([
    { colKey: 'key', title: '名称', width: '100' },
    { colKey: 'value', title: '值', width: '100' }
])

if (apikey.value != '') {
    (() => {
        // return
        axios.get(`https://api.openai-sb.com/sb-api/user/status?api_key=${apikey.value}`).then(res => {
            let json = res.data.data
            if(res.data.code == 500) {
                MessagePlugin.error('获取状态失败，请检查API Key是否填写正确。')
                return
            }
            isLoading.value = false
            moneyBalance.value = (Number(json.credit) / 10000).toFixed(5)
            data.value = [
                {
                    key: '积分余额',
                    value: json.credit
                },
                {
                    key: '已充值CNY(=USD)',
                    value: chargedMoney.value != '' ? `¥(=$)${chargedMoney.value}` : '未设置'
                },
                {
                    key: 'CNY(=USD)余额',
                    value: `¥(=$)${(Number(json.credit) / 10000).toFixed(5)}`
                },
                {
                    key: '累计调用次数',
                    value: json.use_counts
                },
                {
                    key: '累计消耗Tokens',
                    value: json.use_tokens
                },
                {
                    key: 'GPT4开关',
                    value: json.enable_gpt4 ? '开启' : '关闭'
                }
            ]
        })
    })()
}
</script>