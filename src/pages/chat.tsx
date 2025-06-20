import QuestionBox from "../components/question-box/question-box.js";
import {useChatQuestionStore} from "../stores/chat-question-store.js";
import HistoryChatBubble from "../components/chat-bubble/history-chat-bubble.js";
import {useMessagesStore} from "../stores/chat-message-store.js";

const Chat = () => {
    const chatStore = useChatQuestionStore();
    const messagesStorm = useMessagesStore();
    return (
        <div class='w-100% min-w-4xl max-w-4xl max-h-[100%]'>
            {messagesStorm.messages.length == 0 && !chatStore.inside() ?
                <div class='h-dvh flex justify-center items-center flex-col'>
                    <p class={`absolute mb-40 text-center text-4xl pb-4 animate-in fade-in slide-in-from-top duration-300 text-[#353535ff] ${
                        chatStore.question() ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full"
                    }`}>
                        man😉 what can i say?
                    </p>
                    <p class={`absolute mb-40 text-center text-4xl pb-4 animate-in fade-in slide-in-from-bottom duration-300 text-[#353535ff] ${
                        chatStore.question() ? "opacity-0 translate-x-full" : "opacity-100 translate-x-0"
                    }`}>
                        say my angel!😇 say for me!
                    </p>
                    <div>
                        <QuestionBox/>
                    </div>
                </div> :
                <>
                    <div class='pb-40 pt-4'>
                        <HistoryChatBubble/>
                        {chatStore.inside() ?
                            <div class="daisy-text">思考中...</div> :
                            <></>
                        }
                    </div>
                    <div class='fixed bottom-5 z-[99] left-[calc(50vw+88px)] transform -translate-x-1/2'>
                        <QuestionBox/>
                    </div>
                </>
            }
        </div>
    )
}

export default Chat
