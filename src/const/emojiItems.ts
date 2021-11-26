// 777の7はゲーム難易度問わず必ず入れたいからここの配列には入れずに乱数生成時に一番大きい数を番兵にして扱った方がいいかも
import emoji from "node-emoji"
const emojiItems: string[] = [
    emoji.get('coffee'),
    emoji.get('pizza'),
    emoji.get('mushroom'),
    emoji.get('watermelon'),
    emoji.get('rice_ball'),
    emoji.get('sheep'),
    emoji.get('sunglasses'),
    emoji.get('innocent'),
    emoji.get('sob'),
    emoji.get('scream'),
    emoji.get('pleading_face'),
    emoji.get('cactus'),
    emoji.get('fries'),
    emoji.get('sushi'),
    emoji.get('ghost'),
    emoji.get('fire')
]

export default emojiItems