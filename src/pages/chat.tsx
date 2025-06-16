import QuestionBox from "../components/question-box/question-box.js";
import {useChatQuestionStore} from "../stores/chat-question-store.js";
import HistoryChatBubble from "../components/chat-bubble/history-chat-bubble.js";

const Chat = () => {
    const {inside} = useChatQuestionStore()
    return (
        <div class='w-100% p-2 min-w-4xl max-w-4xl'>
            <div class='pb-40'>
                <HistoryChatBubble/>
                {inside() ?
                    <div class="daisy-text">思考中...</div> :
                    <></>
                }
            </div>
            <div class='fixed bottom-5 z-[99] left-[calc(50vw+88px)] transform -translate-x-1/2'>
                <QuestionBox/>
            </div>
        </div>
    )
}

export default Chat
