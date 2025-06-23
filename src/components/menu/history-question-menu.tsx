import type {Component} from "solid-js";
import {onMount, Show} from "solid-js";
import HistoryConversation from "../../type/history-conversation.js";
import {useChatConversationStore} from "../../stores/chat-conversation-store.js";
import {useMessagesStore} from "../../stores/chat-message-store.js";
import {useChatQuestionStore} from "../../stores/chat-question-store.js";

const historyQuestionMenu: Component = () => {

    const conversationStore = useChatConversationStore;
    const {removeAllMessage, getMessage} = useMessagesStore()
    const chatStore = useChatQuestionStore()

    onMount(() =>{
        conversationStore().getAllConversation();
    })

    function getHistoryMessage(conversationId: string): void {
        removeAllMessage()
        getMessage(conversationId);
        chatStore.setIsNewQuestion(false);
    }

    return (
        <ul class="menu bg-base-200 rounded-box w-56">
            <li class='menu-title'>聊天</li>
            <Show when={conversationStore().historyConversation().length > 0}
                  fallback={<li class='menu-title'>这里什么都没有哦</li>}>
                {conversationStore().historyConversation().map((data: HistoryConversation) => {
                    return <li class='text-base' onClick={() => {
                        getHistoryMessage(data.conversationId)
                        chatStore.setConversationId(data.conversationId)
                    }}>
                        <a>
                            {data.problemSummary}
                        </a>
                    </li>
                })}
            </Show>
        </ul>
    )
}

export default historyQuestionMenu
