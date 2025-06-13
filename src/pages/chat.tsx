import QuestionBox from "../components/question-box/question-box.js";
import {useChatQuestionStore} from "../stores/chat-question-store.js";
import HistoryChatBubble from "../components/chat-bubble/history-chat-bubble.js";

const Chat = () => {
    const {inside} = useChatQuestionStore()
    return (
        <div class='w-100% p-2'>
            <HistoryChatBubble/>
            {inside() ?
                <div class="daisy-text">思考中...</div> :
                <></>
            }
            <QuestionBox/>
        </div>
    )
}

export default Chat
