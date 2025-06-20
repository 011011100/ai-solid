import {type Component, onMount, Show} from "solid-js";
import {useMessagesStore} from "../stores/chat-message-store.js";
import HistoryConversation from "../type/history-conversation.js";
import {useChatQuestionStore} from "../stores/chat-question-store.js";
import {useChatConversationStore} from "../stores/chat-conversation-store.js";

const sidebar: Component = () => {

    const conversationStore = useChatConversationStore;

    onMount(() =>{
        conversationStore().getAllConversation();
    })

    const {removeAllMessage, getMessage} = useMessagesStore()

    const chatStore = useChatQuestionStore()

    function getHistoryMessage(conversationId: string): void {
        removeAllMessage()
        getMessage(conversationId);
        chatStore.setIsNewQuestion(false);
    }

    function newQuestion() {
        removeAllMessage()
        const uuid = crypto.randomUUID().replace("-","");
        chatStore.setConversationId(uuid);
        chatStore.setIsNewQuestion(true);
    }

    return (
        <>
            <ul class="menu bg-base-200 rounded-box w-56">
                <li onClick={() => newQuestion()}>
                    <a class='flex items-center'>
                        <IconMdiFileDocumentPlusOutline class="w-4 h-4"/>
                        <p class='text-base'>新问题</p>
                    </a>
                </li>
            </ul>
            <ul class="menu bg-base-200 rounded-box w-56">
                <li class='menu-title'>聊天</li>
                <Show when={conversationStore().historyConversation().length > 0} fallback={<li class='menu-title'>这里什么都没有哦</li>}>
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
        </>
)
}

export default sidebar
