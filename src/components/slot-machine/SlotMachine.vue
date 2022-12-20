<script setup lang="ts">
import SlotVue from './Slot.vue'
import GenerateRandIndexes from './utils/GenerateRandIndexes'
import GameManager from './utils/SlotMachineGameManager'
import LinkedList from './utils/LinkedList'
import emojiItems from '../../const/emojiItems'
import RollSpeedByDifficulties, {DEFAULT_DIFFICULTY_NAME} from '../../const/rollSpeedByDifficulties'
import {ArgumentRangeError} from '../../const/errorCodes'
import { reactive, ref, computed } from '@vue/reactivity'
import { watch } from '@vue/runtime-core'

// ---------------------- Types  ----------------------

type Items = {
    top: number,
    middle: number,
    bottom: number
}
type DifficultyNames = keyof typeof RollSpeedByDifficulties

// ---------------------- initialize ----------------------

// ゲームのログデータ類
const gameManager = new GameManager()
const gamePlayCount = ref(0)
const bigCount = ref(0)
const isSlotReachNow = ref(false)
const isGameCleared = ref(false)
// バグ防止用のフラグ
const isOnceCalledReset = ref(false)
const isOnceCalledStartTurnSlot = ref(false)
const isStartedFinalSlotRoll = ref(false)
// ストップボタンのDisabledを管理するためのフラグ変数
const isStoppedLeftSlot = ref(false)
const isStoppedMiddleSlot = ref(false)
const isStoppedRightSlot = ref(false)

// 各スロットのアイテムの中身(emojiItems[]の添字番号)を連結リストで管理
const leftSlotLinkedList = new LinkedList()
const middleSlotLinkedList = new LinkedList()
const rightSlotLinkedList = new LinkedList()
InitializeSlotLinkedList(leftSlotLinkedList)
InitializeSlotLinkedList(middleSlotLinkedList)
InitializeSlotLinkedList(rightSlotLinkedList)

// スロット内の3つのアイテムの中身を管理
const leftSlotItems
    = reactive(InitializeItems(leftSlotLinkedList.getThreeConsecutivedNum().reverse()))
const middleSlotItems
    = reactive(InitializeItems(middleSlotLinkedList.getThreeConsecutivedNum().reverse()))
const rightSlotItems
    = reactive(InitializeItems(rightSlotLinkedList.getThreeConsecutivedNum().reverse()))

/** ユーザーが選択したゲーム難易度 */
const currentDifficulty = ref<DifficultyNames>(DEFAULT_DIFFICULTY_NAME)
/** currentDifficultyによって再計算された値が入る */
const BASE_ROLL_SPEED = ref(300)
// 各スロットの回転速度
const slotTurnSpeed = reactive({
    leftSpeed: GenerateRandSlotRollSpeed(),
    middleSpeed: GenerateRandSlotRollSpeed(),
    rightSpeed: GenerateRandSlotRollSpeed()
})
// IntervalIDの宣言
let leftSlotIntervalID: NodeJS.Timer
let middleSlotIntervalID: NodeJS.Timer
let rightSlotIntervalID: NodeJS.Timer

// ---------------------- Computed, watch ----------------------

// 全てのスロットが止まったことを検知する
const isStoppedAllSlot = computed(() => {
    return isStoppedLeftSlot.value && isStoppedMiddleSlot.value && isStoppedRightSlot.value
})

// ゲーム終了時に実行する処理
watch(isStoppedAllSlot, isStoppedAllSlot => {
    if(isStoppedAllSlot) {
        isOnceCalledReset.value = false
        isGameCleared.value = gameManager.isGameCleared()
    }
})
watch(isGameCleared, (isBig) => {
    if(isBig) bigCount.value++ 
})
watch(currentDifficulty, () => BASE_ROLL_SPEED.value = RollSpeedByDifficulties[currentDifficulty.value])

// ---------------------- handle ----------------------

// 各ストップボタンが押された時に、対応するスロットの回転を止める処理
const handleStopLeftSlot = () => {
    clearInterval(leftSlotIntervalID)
    isStoppedLeftSlot.value = true
    isSlotReachNow.value = gameManager.judgeSlotHorizontalLine(leftSlotItems.middle)
}
const handleStopMiddleSlot = () => {
    clearInterval(middleSlotIntervalID)
    isStoppedMiddleSlot.value = true
    isSlotReachNow.value = gameManager.judgeSlotHorizontalLine(middleSlotItems.middle)
}
const handleStopRightSlot = () => {
    clearInterval(rightSlotIntervalID)
    isStoppedRightSlot.value = true
    isSlotReachNow.value = gameManager.judgeSlotHorizontalLine(rightSlotItems.middle)
}

/** ゲーム設定を初期化する */
const handleResetTurnSlot = () => {
    if(isOnceCalledReset.value) return
    else if(isStoppedAllSlot) {
        isOnceCalledReset.value = true
        isOnceCalledStartTurnSlot.value = false
        isStartedFinalSlotRoll.value = false
        isSlotReachNow.value = false
        isGameCleared.value = false
        gameManager.resetGame()
        // 難易度変更された時のために乱数を再度生成
        slotTurnSpeed.leftSpeed = GenerateRandSlotRollSpeed()
        slotTurnSpeed.middleSpeed = GenerateRandSlotRollSpeed()
        slotTurnSpeed.rightSpeed = GenerateRandSlotRollSpeed()
        StartTurnSlot()
    }
}

// ---------------------- other functions ----------------------

/**
 * スロットのランダムな回転速度を生成
 * @returns 難易度選択により上限値が制御された回転速度の乱数
*/
function GenerateRandSlotRollSpeed(): number {
    return (Math.floor(Math.random() * 100)) + BASE_ROLL_SPEED.value
}
/**
 * 連結リスト内にアイテムを入れ初期化する
 * @param linkedList 初期化したい連結リスト
 */
function InitializeSlotLinkedList(linkedList: LinkedList) {
    const randIndexes = GenerateRandIndexes(emojiItems.length)
    randIndexes.forEach(index => linkedList.push(index))
}
/**
 * 引数に与えられた数列から、新しいItems型を生成し、返す
 * @param values 新しく生成するItemsの各プロパティに代入したい数値の配列
 * @returns items型のオブジェクトを返す
 */
function InitializeItems(values: number[]): Items {
    if(values[0] == null || values[1] == null || values[2] == null) throw new RangeError(ArgumentRangeError.ThreeElementsMissing)
    const items: Items = {
        top: values[0],
        middle: values[1],
        bottom: values[2]
    }
    return items
}
/**
 * Items型のmutable変数の各プロパティに数値を設定する
 * @param items プロパティをセットしたいItems型の変数
 * @param values 各プロパティに代入したい数値の配列
 */
function SetSlotItems(items: Items, values: number[]) {
    if(values[0] == null || values[1] == null || values[2] == null) throw new RangeError(ArgumentRangeError.ThreeElementsMissing)
    items.top = values[0]
    items.middle = values[1]
    items.bottom = values[2]
}
/** 各スロットを回す */
function StartTurnSlot() {
    // 多重呼び出しバグ防止用
    if(isOnceCalledStartTurnSlot.value) return
    isOnceCalledStartTurnSlot.value = true

    const BASE_WAIT_TIME = 1200
    // 左スロット
    setTimeout(() => {
        leftSlotIntervalID = setInterval(() => {
            leftSlotLinkedList.next()
            SetSlotItems(leftSlotItems, leftSlotLinkedList.getThreeConsecutivedNum().reverse())
        }, slotTurnSpeed.leftSpeed)
        isStoppedLeftSlot.value = false
    }, BASE_WAIT_TIME * 1)
    // 中央スロット
    setTimeout(() => {
        middleSlotIntervalID = setInterval(() => {
            middleSlotLinkedList.next()
            SetSlotItems(middleSlotItems, middleSlotLinkedList.getThreeConsecutivedNum().reverse())
        }, slotTurnSpeed.middleSpeed)
        isStoppedMiddleSlot.value = false
    }, BASE_WAIT_TIME * 2)
    // 右スロット
    setTimeout(() => {
        rightSlotIntervalID = setInterval(() => {
            rightSlotLinkedList.next()
            SetSlotItems(rightSlotItems, rightSlotLinkedList.getThreeConsecutivedNum().reverse())
        }, slotTurnSpeed.rightSpeed)
        isStoppedRightSlot.value = false
        // 演出のために反映を少し遅らせる
        setTimeout(() => 
            isStartedFinalSlotRoll.value = true
        , 1000)
    }, BASE_WAIT_TIME * 3)
    gamePlayCount.value++
}

// ---------------------- At first rendering ----------------------

// 初回レンダリング時、スロットを回す処理を行う
StartTurnSlot()

</script>

<template>
    <div class="flex flex-col mx-0 mb-20 my-10">
        <div class="flex justify-center w-full">
            <div class="text-center">
                <p>PLAY COUNT: {{gamePlayCount}}</p>
                <p>BIG COUNT: {{bigCount}}</p>
            </div>
        </div>
        <div class="flex justify-center my-3 w-full">
            <select
                class="focus:outline-none focus:ring-0 bg-green-100 px-3 py-1 border-green-200 border-2 rounded-2xl hover:bg-green-200 hover:border-green-300"
                :disabled="!(isStoppedAllSlot && isStartedFinalSlotRoll)"
                v-model="currentDifficulty"
            >
                <option
                    v-for="(_, difficulty) in RollSpeedByDifficulties"
                    class="text-center"    
                >{{difficulty}}</option>
            </select>
        </div>
        <div class="flex flex-wrap justify-center my-2 w-full">
            <div class="flex flex-col w-35">
                <SlotVue key="left-slot" :indexes="leftSlotItems"></SlotVue>
                <label
                    class="text-center border-2 mx-2 mt-6 mb-3 rounded-lg transition transform hover:bg-yellow-100 hover:border-yellow-200"
                    :class="{ 'translate-y-2': isStoppedLeftSlot, 'bg-yellow-100': isStoppedLeftSlot, 'border-yellow-200': isStoppedLeftSlot}"
                    key="stop-left-slot"
                    v-if="isStartedFinalSlotRoll"
                >
                    <input
                        class="hidden"
                        type="checkbox"
                        v-on:click="handleStopLeftSlot"
                        v-model="isStoppedLeftSlot"
                        :disabled="(isStoppedLeftSlot && !isStartedFinalSlotRoll) || (isStoppedLeftSlot)"
                    >
                    <p class="select-none">Stop</p>
                </label>
            </div>
            <div class="flex flex-col w-35">
                <SlotVue key="middle-slot" :indexes="middleSlotItems"></SlotVue>
                <label
                    class="text-center border-2 mx-2 mt-6 mb-3 rounded-lg transition transform hover:bg-yellow-100 hover:border-yellow-200"
                    :class="{ 'translate-y-2': isStoppedMiddleSlot, 'bg-yellow-100': isStoppedMiddleSlot, 'border-yellow-200': isStoppedMiddleSlot}"
                    key="stop-middle-slot"
                    v-if="isStartedFinalSlotRoll"
                >
                    <input
                        class="hidden"
                        type="checkbox"
                        v-on:click="handleStopMiddleSlot"
                        v-model="isStoppedMiddleSlot"
                        :disabled="(isStoppedMiddleSlot && !isStartedFinalSlotRoll) || (isStoppedMiddleSlot)"
                    >
                    <p class="select-none">Stop</p>
                </label>
            </div>
            <div class="flex flex-col w-35">
                <SlotVue key="right-slot" :indexes="rightSlotItems"></SlotVue>
                <label
                    class="text-center border-2 mx-2 mt-6 mb-3 rounded-lg transition transform hover:bg-yellow-100 hover:border-yellow-200"
                    :class="{ 'translate-y-2': isStoppedRightSlot, 'bg-yellow-100': isStoppedRightSlot, 'border-yellow-200': isStoppedRightSlot}"
                    key="stop-right-slot"
                    v-if="isStartedFinalSlotRoll"
                >
                    <input
                        class="hidden"
                        type="checkbox"
                        v-on:click="handleStopRightSlot"
                        v-model="isStoppedRightSlot"
                        :disabled="(isStoppedRightSlot && !isStartedFinalSlotRoll) || (isStoppedRightSlot)"
                    >
                    <p class="select-none">Stop</p>
                </label>
            </div>
        </div>
        <div class="flex flex-col justify-center my-2 w-full">
            <div class="text-center">
                <p
                    v-if="isGameCleared"
                    class="font-black text-4xl font-serif tracking-widest"
                >BIG!</p>
                <p
                    v-else-if="isStoppedAllSlot && isStartedFinalSlotRoll"
                    class="font-black text-2xl font-serif tracking-wide"
                >FAILED...</p>
            </div>
            <div class="text-center">
                <p
                    v-if="isSlotReachNow"
                    class="font-light text-3xl font-serif tracking-wide"
                >reach now!</p>
            </div>
        </div>
        <div class="flex justify-center my-5 w-full">
            <button
                class="text-center border-4 px-10 py-2 bg-red-400 border-red-100 hover:bg-red-500 hover:border-red-300"
                v-on:click="handleResetTurnSlot"
                v-if="isStoppedAllSlot && isStartedFinalSlotRoll"
                :disabled="!(isStoppedAllSlot && isStartedFinalSlotRoll)"
            >
                <p class="text-white select-none">REPLAY</p>
            </button>
        </div>
    </div>
</template>